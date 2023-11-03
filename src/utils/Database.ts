import sqlite3 from "sqlite3";

class Database {
    private static instance: Database | null = null;
    private db: sqlite3.Database | null = null;

    private constructor(dbPath: string) {
        this.db = new sqlite3.Database(dbPath);
    }

    public static getInstance(dbPath: string) {
        if (this.instance === null) {
            this.instance = new Database(dbPath);
        }
        return this.instance;
    }

    public getDatabase() {
        if (this.db === null) {
            throw new Error("Database connection is not established");
        }
        return this.db;
    }

    public closeDatabase() {
        if (this.db !== null) {
            this.db.close((error) => {
                if (error) {
                    throw new Error(error.message);
                }
            });
            this.db = null;
            Database.instance = null;
        }
    }
}

export default Database;
