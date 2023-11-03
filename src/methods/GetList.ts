import { GetListParams } from "../interfaces/MethodParams";
import { GetListResponse } from "@refinedev/core";
import { generateFilter } from "../utils/generateFilter";
import { generateSort } from "../utils/generateSort";
import { promisify } from "util";
import sqlite3 from "sqlite3";
import Database from "../utils/Database";

class GetList {
    private static dbInstance: Database;
    private db: sqlite3.Database | null = null;

    private constructor(dbPath: string) {
        GetList.dbInstance = Database.getInstance(dbPath);
        this.db = GetList.dbInstance.getDatabase();
    }

    static async build(dbPath: string, params: GetListParams): Promise<GetListResponse> {
        const init = new GetList(dbPath);
        const { resource, pagination, filters, sorters } = params;

        try {
            if (!init.db)
                throw new Error("Database connection not available.");

            const {
                current = 1,
                pageSize = 10,
            } = pagination ?? {};

            const queryFilters = generateFilter(filters);

            const query: {
                _start?: number;
                _end?: number;
                _sortString?: string;
            } = {};

            query._start = (current - 1) * pageSize;
            query._end = current * pageSize;

            const generatedSort = generateSort(sorters);
            if (generatedSort) query._sortString = generatedSort;

            const dbAll = promisify(init.db.all.bind(init.db));

            let sql = `SELECT * FROM ${resource}`;

            if (pagination) sql += ` LIMIT ${query._start}, ${query._end}`;
            if (queryFilters) sql += ` WHERE ${queryFilters}`;
            if (generatedSort) sql += ` ORDER BY ${query._sortString}`;

            const data = await dbAll(sql) as Array<any>;

            if (data)
                return {
                    data,
                    total: data?.length ?? 0
                };
            else
                throw new Error(`No data found in ${resource}`);

        } catch (error) {
            console.error("Error in getList()", error);
            return {
                data: [],
                total: 0
            }
        } finally {
            this.dbInstance.closeDatabase();
        }
    }
}

export default GetList;
