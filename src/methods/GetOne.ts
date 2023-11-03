import { GetOneResponse } from "@refinedev/core";
import { GetOneParams } from "src/interfaces/MethodParams";
import { promisify } from "util";
import sqlite3 from "sqlite3";
import Database from "../utils/Database";

class GetOne {
    private static dbInstance: Database;
    private db: sqlite3.Database | null = null;

    private constructor(dbPath: string) {
        GetOne.dbInstance = Database.getInstance(dbPath);
        this.db = GetOne.dbInstance.getDatabase();
    }

    static async build(dbPath: string, params: GetOneParams): Promise<GetOneResponse> {
        const init = new GetOne(dbPath);
        const { resource, id } = params;

        try {
            if (!init.db)
                throw new Error("Database connection not available.");

            const res = promisify(init.db.get.bind(init.db));
            const sql = `SELECT * FROM ${resource} WHERE id = ${id}`;
            const data = await res(sql) as any

            if (data)
                return { data };
            else
                throw new Error(`No data found in ${resource} and id ${id}`);
        } catch (error) {
            console.error("Error in getOne()", error);
            return {
                data: {}
            }
        } finally {
            this.dbInstance.closeDatabase();
        }
    }
}

export default GetOne;
