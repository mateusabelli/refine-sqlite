import { DeleteOneResponse } from "@refinedev/core";
import { DeleteOneParams } from "src/interfaces/MethodParams";
import { promisify } from "util";
import sqlite3 from "sqlite3";
import Database from "../utils/Database";

class DeleteOne {
    private static dbInstance: Database;
    private db: sqlite3.Database | null = null;

    private constructor(dbPath: string) {
        DeleteOne.dbInstance = Database.getInstance(dbPath);
        this.db = DeleteOne.dbInstance.getDatabase();
    }

    static async build(dbPath: string, params: DeleteOneParams): Promise<DeleteOneResponse<null>> {
        const init = new DeleteOne(dbPath);
        const { resource, id } = params;

        try {
            if (!init.db)
                throw new Error("Database connection not available.");

            let deleteSql = `DELETE FROM ${resource} WHERE id = ${id}`;
            let selectSql = `SELECT * FROM ${resource} WHERE id = ${id}`;

            const dbRun = promisify(init.db.run.bind(init.db));
            await dbRun(deleteSql);

            const dbGet = promisify(init.db.get.bind(init.db));
            const data = await dbGet(selectSql) as any;

            if (data)
                throw new Error(`Could not delete data in ${resource} with id ${id}`);
            else
                return {
                    data: null
                }
        } catch (error) {
            console.error("Error in deleteOne()", error);
            return {
                data: null
            }
        } finally {
            this.dbInstance.closeDatabase();
        }
    }
}

export default DeleteOne;
