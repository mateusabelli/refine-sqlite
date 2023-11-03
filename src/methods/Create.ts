import { CreateResponse } from "@refinedev/core";
import { CreateParams } from "src/interfaces/MethodParams";
import { promisify } from "util";
import sqlite3 from "sqlite3";
import Database from "../utils/Database";

class Create {
    private static dbInstance: Database;
    private db: sqlite3.Database | null = null;

    private constructor(dbPath: string) {
        Create.dbInstance = Database.getInstance(dbPath);
        this.db = Create.dbInstance.getDatabase();
    }

    static async build(dbPath: string, params: CreateParams): Promise<CreateResponse> {
        const init = new Create(dbPath);
        const { resource, variables } = params;

        try {
            if (!init.db)
                throw new Error("Database connection not available.");

            const columns = Object.keys(variables).join(", ")
            const values = Object.values(variables).map((value) => `'${value}'`).join(", ")

            let insertSql = `INSERT INTO ${resource} (${columns}) VALUES (${values})`;
            let selectSql = `SELECT * FROM ${resource} WHERE (${columns}) = (${values})`;

            const dbRun = promisify(init.db.run.bind(init.db));
            await dbRun(insertSql);

            const dbGet = promisify(init.db.get.bind(init.db));
            const data = await dbGet(selectSql) as any;

            if (data)
                return { data }
            else
                throw new Error(`Could not create data in ${resource}`);
        } catch (error) {
            console.error("Error in create()", error);
            return {
                data: {}
            }
        } finally {
            this.dbInstance.closeDatabase();
        }
    }
}

export default Create;
