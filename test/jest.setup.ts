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
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error("Error creating the database.", err);
            }
        });

        // Read the sql file
        const sql = fs.readFileSync("./test.sql").toString();
        const sqlArray = sql.split(";")

        // Create the tables
        await new Promise<void>((resolve, reject) => {
            db.serialize(() => {
                for (let i = 0; i < sqlArray.length - 1; i++) {
                    if (sqlArray[i].trim() === "") continue;

                    db.run(sqlArray[i], (err) => {
                        if (err) {
                            console.error("Error running queries: ", err);
                            reject(err);
                        }
                    });
                }
            });
            db.close((err) => {
                if (err) {
                    console.error("Error closing the database: ", err);
                    reject(err);
                }
                resolve();
            });
        });
    } catch (error) {
        console.error("Error in beforeAll: ", error);
    }
})
