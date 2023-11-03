import { GetManyResponse } from "@refinedev/core";
import { GetManyParams } from "src/interfaces/MethodParams";
import { promisify } from "util";
import sqlite3 from "sqlite3";
import Database from "../utils/Database";

class GetMany {
    private static dbInstance: Database;
    private db: sqlite3.Database | null = null;

    private constructor(dbPath: string) {
        GetMany.dbInstance = Database.getInstance(dbPath);
        this.db = GetMany.dbInstance.getDatabase();
    }

    static async build(dbPath: string, params: GetManyParams): Promise<GetManyResponse> {
        const init = new GetMany(dbPath);
        const { resource, ids } = params;

        try {
            if (!init.db)
                throw new Error("Database connection not available.");

            let idString = ids.join(", ");

            const res = promisify(init.db.all.bind(init.db));
            const sql = `SELECT * FROM ${resource} WHERE id IN (${idString})`;
            const data = await res(sql) as Array<any>;

            const dbClose = promisify(init.db.close.bind(init.db));
            await dbClose();

            if (data)
                return { data };
            else
                throw new Error(`No data found in ${resource} and ids ${idString}`);
        } catch (error) {
            console.error("Error in getMany()", error);
            return {
                data: []
            }
        } finally {
            this.dbInstance.closeDatabase();
        }
    }
}

export default GetMany;
