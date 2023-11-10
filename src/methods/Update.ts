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
    }
}

export default Update;
