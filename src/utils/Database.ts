import initSqlJs from "sql.js"
import fetch from "cross-fetch"

class Database {
    private static SQL: initSqlJs.SqlJsStatic

    private constructor() { }

    public static async init(databasePath: string, databaseType?: undefined | "inMemory"): Promise<initSqlJs.Database> {
        this.SQL = await initSqlJs({
            locateFile: () => "node_modules/sql.js/dist/sql-wasm.wasm"
        });

        if (databaseType === "inMemory") {
            return await this.inMemoryDatabase(databasePath);
        }

        return await this.localDatabase(databasePath);
    }

    private static async localDatabase(databasePath: string): Promise<initSqlJs.Database> {
        const fs = require("fs");
        const databaseFile = fs.readFileSync(databasePath);
        return new this.SQL.Database(databaseFile);
    }

    private static async inMemoryDatabase(databasePath: string): Promise<initSqlJs.Database> {
        const databaseFile = await fetch(databasePath).then(res => res.arrayBuffer());
        return new this.SQL.Database(new Uint8Array(databaseFile))
    }
}

// class Database {
//     private static instance: Database | null = null;
//     private db: sqlite3.Database | null = null;
//
//     private constructor(dbPath: string) {
//         this.db = new sqlite3.Database(dbPath);
//     }
//
//     public static getInstance(dbPath: string) {
//         if (this.instance === null) {
//             this.instance = new Database(dbPath);
//         }
//         return this.instance;
//     }
//
//     public getDatabase() {
//         if (this.db === null) {
//             throw new Error("Database connection is not established");
//         }
//         return this.db;
//     }
//
//     public closeDatabase() {
//         if (this.db !== null) {
//             this.db.close((error) => {
//                 if (error) {
//                     throw new Error(error.message);
//                 }
//             });
//             this.db = null;
//             Database.instance = null;
//         }
//     }
// }

export default Database;
