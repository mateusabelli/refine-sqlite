import { UpdateResponse } from "@refinedev/core";
import { UpdateParams } from "src/interfaces/MethodParams";
import { promisify } from "util";
import sqlite3 from "sqlite3";
import Database from "../utils/Database";

class Update {
    private static dbInstance: Database;
    private db: sqlite3.Database | null = null;

    private constructor(dbPath: string) {
        Update.dbInstance = Database.getInstance(dbPath);
        this.db = Update.dbInstance.getDatabase();
    }

    static async build(dbPath: string, params: UpdateParams): Promise<UpdateResponse> {
        const init = new Update(dbPath);
        const { resource, id, variables } = params;

        try {
            if (!init.db)
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

            const dbRun = promisify(init.db.run.bind(init.db));
            await dbRun(updateSql);

            const dbGet = promisify(init.db.get.bind(init.db));
            const data = await dbGet(selectSql) as any;

            if (data)
                return { data };
            else
                throw new Error(`Could not update data in ${resource}`);
        } catch (error) {
            console.error("Error in update()", error);
            return {
                data: {}
            }
        } finally {
            this.dbInstance.closeDatabase()
        }
    }
}

export default Update;
