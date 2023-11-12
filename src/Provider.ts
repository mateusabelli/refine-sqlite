import { BaseRecord, DataProvider } from "@refinedev/core";
import * as Types from "@refinedev/core/dist/contexts/data/IDataContext"

import { Database as SQLiteDatabase } from "sql.js"
import Database from "./utils/Database";

class Provider implements DataProvider {
    private databasePath: string
    private databaseType: 'local' | 'inMemory'

    constructor(databaseType: 'local' | 'inMemory', databasePath: string) {
        this.databasePath = databasePath;
        this.databaseType = databaseType;
    }

    private async dbConnect(): Promise<SQLiteDatabase | void> {
        try {
            return await Database.init(this.databaseType, this.databasePath);
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
                        dataColumns.map((col, index) => [col, dataValues[index]]),
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
                        dataColumns.map((col, index) => [col, dataValues[index]]),
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

    getList!: <TData extends BaseRecord = BaseRecord>(params: Types.GetListParams) => Promise<Types.GetListResponse<TData>>;
    getOne!: <TData extends BaseRecord = BaseRecord>(params: Types.GetOneParams) => Promise<Types.GetOneResponse<TData>>;
    deleteOne!: <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: Types.DeleteOneParams<TVariables>) => Promise<Types.DeleteOneResponse<TData>>;
    getApiUrl!: () => string;

    // deleteOne(params: DeleteOneParams) {
    //     return DeleteOne.build(this.dbPath, params);
    // }
    //
    // getOne(params: GetOneParams) {
    //     return GetOne.build(this.dbPath, params);
    // }
    //
    // getMany(params: GetManyParams) {
    //     return GetMany.build(this.dbPath, params);
    // }
    //
    // getList(params: GetListParams) {
    //     return GetList.build(this.dbPath, params);
    // }
}
export const dataProvider = (databaseType: 'local' | 'inMemory', databasePath: string) => {
    return new Provider(databaseType, databasePath);
}

