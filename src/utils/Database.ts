import sqlite3 from "sqlite3";

class Database {
    private static instance: sqlite3.Database | null = null;
    private constructor() { }

    public static create(dbPath: string): sqlite3.Database {
        if (!Database.instance) {
            Database.instance = new sqlite3.Database(dbPath, (error) => {
                if (error) throw new Error(error.message);
            });
        }

        return Database.instance;
    }
}

export default Database;
