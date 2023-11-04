import initSqlJs from "sql.js";
import fs from "fs";

beforeAll(async () => {
    const dbPath = "test.db";

    try {
        // Delete the database if it exists (DB must be disconnected elsewhere)
        if (fs.existsSync(dbPath)) {
            fs.rmSync(dbPath);
        }

        // Create the database
        const SQL = await initSqlJs({
            locateFile: () => "node_modules/sql.js/dist/sql-wasm.wasm"
        });
        const db = new SQL.Database();

        // Read the sql file
        const sql = fs.readFileSync("./test.sql").toString();
        const sqlArray = sql.split(";");

        // Create the tables
        for (let i = 0; i < sqlArray.length - 1; i++) {
            if (sqlArray[i].trim() === "") continue;

            try {
                db.run(sqlArray[i]);
            } catch (error) {
                console.error("Error running queries: ", error);
            }
        }

        // Write the database
        const data = db.export();
        fs.writeFileSync(dbPath, new Uint8Array(data));

        // Close the connection
        db.close();

    } catch (error) {
        console.error("Error in beforeAll: ", error);
    }
});

