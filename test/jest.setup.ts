import sqlite3 from "sqlite3";
import fs from "fs";

beforeAll(async () => {
    const dbPath = "test.db";
    try {
        // Delete the database if it exists (DB must be disconnected first)
        if (fs.existsSync(dbPath)) {
            fs.rmSync(dbPath);
        }
        // Create the database
        const db = new sqlite3.Database(dbPath);

        // Read the sql file
        const sql = fs.readFileSync("./test.sql").toString();
        const sqlArray = sql.split(";")

        // Create the tables
        await new Promise<void>((resolve, reject) => {
            // TODO: Fix the SQLITE_MISUSE error when using db.serialize(). It doesn't work without db.serialize()
            db.serialize(() => {
                sqlArray.forEach((query) => {
                    // Append the semicolon to the query
                    query += ";";

                    db.run(query, (err) => {
                        if (err) {
                            console.error("Error in database table creation: ", err);
                            reject(err);
                        }
                    });
                });
            });
            db.close();
        });
    } catch (error: any) {
        console.error("Error in beforeAll: ", error);
    }
})
