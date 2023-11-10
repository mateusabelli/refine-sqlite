import initSqlJs, {Database as SQLiteDatabase} from "sql.js"
import fetch from "cross-fetch"

class Database {
    private constructor() { }

    public static async init(dbPath: string): Promise<SQLiteDatabase> {
        const SQL = await initSqlJs({
            locateFile: () => "node_modules/sql.js/dist/sql-wasm.wasm"
        });

        const dbFile = await fetch(dbPath).then(res => res.arrayBuffer());
        return new SQL.Database(new Uint8Array(dbFile))
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
