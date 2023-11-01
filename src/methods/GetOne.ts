import { GetOneParams } from "src/interfaces/MethodParams";
import { BaseRecord, GetOneResponse } from "@refinedev/core";
import sqlite3 from "sqlite3";
import { promisify } from "util";

class GetOne {
    private db: sqlite3.Database | null = null;

    constructor(db: sqlite3.Database) {
        this.db = db;
    }

    async build<TData extends BaseRecord = BaseRecord>(
        params: GetOneParams
    ): Promise<GetOneResponse<TData>> {
        const { resource, id } = params;

        try {
            if (!this.db)
                throw new Error("Database connection not available.");

            const res = promisify(this.db.get.bind(this.db));
            const sql = `SELECT * FROM ${resource} WHERE id = ${id}`;
            const data = await res(sql) as any

            if (data)
                return { data };
            else
                throw new Error(`No data found in ${resource} and id ${id}`);
        } catch (error) {
            console.error("Error in getOne()", error);
            return {
                data: {} as TData
            }
        }
    }
}

export default GetOne;
