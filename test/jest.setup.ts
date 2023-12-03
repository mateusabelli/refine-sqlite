import Database from 'better-sqlite3';
import fs from "fs";

beforeAll(async () => {
    const dbPath = "test/test.db";
    try {
        // Delete the database if it exists (DB must be disconnected first)
        if (fs.existsSync(dbPath)) {
            fs.rmSync(dbPath);
        }

        // Create the database
        const db = new Database(dbPath)
        db.pragma('journal_mode = WAL');

        // Create the tables
        const migration = fs.readFileSync('test/test.sql', 'utf8');
        db.exec(migration);
        db.close()
    } catch (error) {
        console.error("[JEST] Error in beforeAll: ", error);
    }
})