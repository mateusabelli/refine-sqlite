import sqlite3 from "sqlite3";
import { DataProvider } from "./interfaces/DataProvider";
import { GetOneParams } from "./interfaces/MethodParams";
import Database from "./utils/Database";
import GetOne from "./methods/GetOne";
import { BaseRecord, GetOneResponse } from "@refinedev/core";

class Provider implements DataProvider {
    private db: sqlite3.Database | null = null;

    constructor(dbPath: string) {
        this.db = Database.create(dbPath);
    }

    async getOne<TData extends BaseRecord = BaseRecord>(
        params: GetOneParams,
    ): Promise<GetOneResponse<TData>> {
        if (!this.db)
            throw new Error("Database connection not available.");

        return new GetOne(this.db).build(params);
    }
}

export const dataProvider = (dbPath: string) => {
    return new Provider(dbPath);
};
