import sqlite3 from "sqlite3";
import fs from "fs";

beforeAll(async () => {
    try {
        // Connect to the database
        const db = new sqlite3.Database("./test.db");

        // Clean the database
        const dbTables = await new Promise((resolve, reject) => {
            const sql = "SELECT name FROM sqlite_master WHERE type='table';"

            db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        }) as Array<any>

        dbTables.forEach((table) => {
            const sql = `DROP TABLE ${table["name"]}`;

            db.run(sql, (err) => {
                if (err) {
                    throw new Error("Error in database clean up" + err);
                }
            });
        });

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
    } catch (error) {
        console.error("Error in beforeAll: ", error);
    }
})