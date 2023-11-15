import { BaseRecord, DataProvider } from "@refinedev/core";
import * as Types from "@refinedev/core/dist/contexts/data/IDataContext"

import fetch from "cross-fetch";
import { generateFilter, generateSort } from "./utils";
import { Database as SQLiteDatabase } from "sql.js"
import Database from "./utils/Database";
import initSqlJs from "sql.js";

let databaseInstance: { initialized: boolean } | null = null;
let databaseString: string | null = null;

function toBinString(uarr: Uint8Array): string {
    const strings: string[] = [];
    const chunkSize = 0xffff;

    // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
    for (let i = 0; i * chunkSize < uarr.length; i++) {
        strings.push(String.fromCharCode.apply(null, Array.from(uarr.subarray(i * chunkSize, (i + 1) * chunkSize))));
    }

    return strings.join('');
}

function toBinArray(str: string): Uint8Array {
    const l = str.length;
    const arr = new Uint8Array(l);

    for (let i = 0; i < l; i++) {
        arr[i] = str.charCodeAt(i);
    }

    return arr;
}

async function dbConnect(databasePath: string) {
    const SQL = await initSqlJs({
        locateFile: () => "node_modules/sql.js/dist/sql-wasm.wasm"
    });

    if (!databaseInstance) {
        try {
            const databaseFile = await fetch(databasePath)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => new Uint8Array(arrayBuffer));

            databaseInstance = { initialized: true };
            const database = new SQL.Database(databaseFile);
            console.log("BEFORE", database.exec("SELECT * FROM posts")[0].values)

            databaseString = toBinString(database.export())
            console.log('Database initialized');

            return database
        } catch (error) {
            console.error("Error in dbConnect()", error);
        }
    }
    console.log('Database already initialized');
    const database = new SQL.Database(toBinArray(databaseString!))
    console.log("AFTER", database.exec("SELECT * FROM posts")[0].values)
    return new SQL.Database(toBinArray(databaseString!))
}

export const dataProvider = (
    databasePath: string,
    databaseType?: undefined | 'inMemory'
): Omit<
    Required<DataProvider>,
    "createMany" |
    "updateMany" |
    "deleteMany" |
    "custom" |
    "getMany" |
    "getOne" |
    "update" |
    "deleteOne" |
    "getApiUrl"
> & { close: () => void; } => ({
    close: () => {
        databaseInstance = null;
        databaseString = null;
    },
    create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(
        params: Types.CreateParams<TVariables>,
    ): Promise<Types.CreateResponse<TData>> => {
        const database = await dbConnect(databasePath);
        const { resource, variables } = params;

        try {
            if (!database)
                throw new Error("Database connection not available.");

            if (!variables)
                throw new Error("Variables were not provided.");

            const columns = Object.keys(variables).join(", ")
            const values = Object.values(variables).map((value) => `'${value}'`).join(", ")

            let insertSql = `INSERT INTO ${resource} (${columns}) VALUES (${values})`;
            let selectSql = `SELECT * FROM ${resource} WHERE (${columns}) = (${values})`;

            database.run(insertSql);
            const data = database.exec(selectSql)
            const dataColumns = data[0].columns
            const dataValues = data[0].values[0]

            if (data) {
                return {
                    data: Object.fromEntries(
                        dataColumns.map((column, index) => [column, dataValues[index]]),
                    ) as TData
                }
            } else {
                throw new Error(`Could not create data in ${resource}`);
            }
        } catch (error) {
            console.error("Error in create()", error);
            return {
                data: {} as TData
            }
        } finally {
            databaseString = toBinString(database.export())
            database?.close()
        }
    },
    getList: async <TData extends BaseRecord = BaseRecord>(
        params: Types.GetListParams,
    ): Promise<Types.GetListResponse<TData>> => {
        const database = await dbConnect(databasePath);
        const { resource, pagination, filters, sorters } = params;

        try {
            if (!database)
                throw new Error("Database connection not available.");

            const {
                current = 1,
                pageSize = 10,
            } = pagination ?? {};

            const queryFilters = generateFilter(filters);

            const query: {
                _start?: number;
                _end?: number;
                _sortString?: string;
            } = {};

            query._start = (current - 1) * pageSize;
            query._end = current * pageSize;

            const generatedSort = generateSort(sorters);
            if (generatedSort) query._sortString = generatedSort;

            let sql = `SELECT * FROM ${resource}`;

            if (pagination) sql += ` LIMIT ${query._start}, ${query._end}`;
            if (queryFilters) sql += ` WHERE ${queryFilters}`;
            if (generatedSort) sql += ` ORDER BY ${query._sortString}`;

            const data = database.exec(sql)
            const dataColumns = data[0].columns
            const dataValues = data[0].values

            if (data) {
                return {
                    data: dataValues.map((values) => (
                        Object.fromEntries(values.map((value, index) => [dataColumns[index], value]))
                    )) as TData[],
                    total: dataValues?.length ?? 0
                }
            } else {
                throw new Error(`No data found in ${resource}`);
            }
        } catch (error) {
            console.error("Error in getList()", error);
            return {
                data: [],
                total: 0
            }
        } finally {
            databaseString = toBinString(database.export())
            database?.close()
        }
    },
})
