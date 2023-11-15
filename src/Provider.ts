import { BaseRecord, DataProvider } from "@refinedev/core";
import * as Types from "@refinedev/core/dist/contexts/data/IDataContext"

import { generateFilter, generateSort } from "./utils";
import { Database as SQLiteDatabase } from "sql.js"
import Database from "./utils/Database";

class Provider implements DataProvider {
    private databasePath: string
    private databaseType?: undefined | 'inMemory'

    constructor(databasePath: string, databaseType?: undefined | 'inMemory') {
        this.databasePath = databasePath;
        this.databaseType = databaseType;
    }

    private async dbConnect(): Promise<SQLiteDatabase | void> {
        try {
            return await Database.init(this.databasePath, this.databaseType);
        } catch (error) {
            console.error("Error in dbConnect()", error);
        }
    }

    public async create<TData extends BaseRecord = BaseRecord, TVariables = {}>
        (params: Types.CreateParams<TVariables>): Promise<Types.CreateResponse<TData>> {

        const database = await this.dbConnect();
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
            database?.close()
        }
    }

    public async update<TData extends BaseRecord = BaseRecord, TVariables = {}>
        (params: Types.UpdateParams<TVariables>): Promise<Types.UpdateResponse<TData>> {

        const database = await this.dbConnect();
        const { resource, id, variables } = params;

        try {
            if (!database)
                throw new Error("Database connection not available.");

            const columns = Object.keys(variables || {});
            const values = Object.values(variables || {});

            let updateQuery = "";

            columns.forEach((column, index) => {
                updateQuery += `${column} = '${values[index]}', `;
            });

            // Slices the last comma
            updateQuery = updateQuery.slice(0, -2);

            const updateSql = `UPDATE ${resource} SET ${updateQuery} WHERE id = ${id}`;
            const selectSql = `SELECT * FROM ${resource} WHERE id = ${id}`;

            database.run(updateSql);
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
                throw new Error(`Could not update data in ${resource}`);
            }
        } catch (error) {
            console.error("Error in update()", error);
            return {
                data: {} as TData
            }
        } finally {
            database?.close()
        }
    }


    public async deleteOne<TData extends BaseRecord = BaseRecord, TVariables = {}>
        (params: Types.DeleteOneParams<TVariables>): Promise<Types.DeleteOneResponse<TData>> {

        const database = await this.dbConnect();
        const { resource, id } = params;

        try {
            if (!database)
                throw new Error("Database connection not available.");

            let deleteSql = `DELETE FROM ${resource} WHERE id = ${id}`;
            let selectSql = `SELECT * FROM ${resource} WHERE id = ${id}`;

            database.run(deleteSql);
            const data = database.exec(selectSql)

            if (data.length > 0) {
                throw new Error(`Could not delete data in ${resource} with id ${id}`);
            } else {
                return {
                    data: {} as TData
                }
            }
        } catch (error) {
            console.error("Error in deleteOne()", error);
            return {
                data: {} as TData
            }
        } finally {
            database?.close()
        }
    }

    public async getOne<TData extends BaseRecord = BaseRecord>
        (params: Types.GetOneParams): Promise<Types.GetOneResponse<TData>> {

        const database = await this.dbConnect();
        const { resource, id } = params;

        try {
            if (!database)
                throw new Error("Database connection not available.");

            const selectSql = `SELECT * FROM ${resource} WHERE id = ${id}`;

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
                throw new Error(`No data found in ${resource} and id ${id}`);
            }
        } catch (error) {
            console.error("Error in getOne()", error);
            return {
                data: {} as TData
            }
        } finally {
            database?.close()
        }
    }

    public async getMany<TData extends BaseRecord = BaseRecord>
        (params: Types.GetManyParams): Promise<Types.GetManyResponse<TData>> {

        const database = await this.dbConnect();
        const { resource, ids } = params;

        try {
            if (!database)
                throw new Error("Database connection not available.");

            let idString = ids.join(", ");

            const selectSql = `SELECT * FROM ${resource} WHERE id IN (${idString})`;

            const data = database.exec(selectSql)
            const dataColumns = data[0].columns
            const dataValues = data[0].values

            if (data) {
                return {
                    data: dataValues.map((values) => (
                        Object.fromEntries(values.map((value, index) => [dataColumns[index], value]))
                    )) as TData[]
                }
            } else {
                throw new Error(`No data found in ${resource} and ids ${idString}`);
            }
        } catch (error) {
            console.error("Error in getMany()", error);
            return {
                data: []
            }
        } finally {
            database?.close()
        }
    }

    public async getList<TData extends BaseRecord = BaseRecord>
        (params: Types.GetListParams): Promise<Types.GetListResponse<TData>> {

        const database = await this.dbConnect();
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
            database?.close()
        }
    }

    public getApiUrl(): string {
        return this.databasePath
    }
}

export const dataProvider = (databasePath: string, databaseType?: undefined | 'inMemory') => {
    return new Provider(databasePath, databaseType);
}

