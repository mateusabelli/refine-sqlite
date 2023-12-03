import {
    BaseRecord,
    CreateParams,
    DeleteOneParams,
    GetListParams,
    GetManyParams,
    GetOneParams,
    UpdateParams
} from "@refinedev/core";
import { generateSort, generateFilter } from "./utils";
import Database from "better-sqlite3";

const dbConnect = (dbPath: string) => {
    const db = new Database(dbPath)
    db.pragma('journal_mode = WAL');

    return db;
}

export const dataProvider = (
    dbPath: string
) => ({
    getList: ({ resource, pagination, filters, sorters }: GetListParams) => {
        const db = dbConnect(dbPath);

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
        if (generatedSort) {
            query._sortString = generatedSort;
        }

        let sql = `SELECT * FROM ${resource}`;

        if (queryFilters) sql += ` WHERE ${queryFilters}`;
        if (generatedSort) sql += ` ORDER BY ${query._sortString}`;
        if (pagination) sql += ` LIMIT ${query._start}, ${query._end}`;

        try {
            const stmt = db.prepare(sql)
            const data = stmt.all() as Array<BaseRecord>;

            return {
                data,
                total: data.length,
            };
        } catch (error) {
            console.error("Error in getList()", error);
            return {
                data: [],
                total: 0,
            }
        } finally {
            db.close();
        }
    },

    getMany: ({ resource, ids }: GetManyParams) => {
        const db = dbConnect(dbPath);
        const idString = ids.join(", ")

        try {
            const stmt = db.prepare(`SELECT * FROM ${resource} WHERE id IN (${idString})`)
            const data = stmt.all() as Array<BaseRecord>;

            return {
                data,
            };
        } catch (error) {
            console.error("Error in getMany()", error);
            return {
                data: [],
            }
        } finally {
            db.close()
        }
    },

    create: ({ resource, variables }: CreateParams) => {
        const db = dbConnect(dbPath);

        const columns = Object.keys(variables || {}).join(", ")
        const values = Object.values(variables || {}).map((value) => `'${value}'`).join(", ")

        try {
            const stmt = db.prepare(`INSERT INTO ${resource} (${columns}) VALUES (${values})`)
            const { lastInsertRowid } = stmt.run()

            const stmt2 = db.prepare(`SELECT * FROM ${resource} WHERE id = ${lastInsertRowid}`)
            const data = stmt2.get() as BaseRecord;

            return {
                data,
            };
        } catch (error) {
            console.error("Error in create()", error);
            return {
                data: {}
            }
        } finally {
            db.close()
        }
    },

    update: ({ resource, id, variables }: UpdateParams) => {
        const db = dbConnect(dbPath);
        let updateQuery = "";

        const columns = Object.keys(variables || {})
        const values = Object.values(variables || {});

        columns.forEach((column, index) => {
            updateQuery += `${column} = '${values[index]}', `;
        });

        // Slices the last comma
        updateQuery = updateQuery.slice(0, -2);

        try {
            db.prepare(`UPDATE ${resource} SET ${updateQuery} WHERE id = ?`)
                .run(id)

            const stmt = db.prepare(`SELECT * FROM ${resource} WHERE id = ?`)
            const data = stmt.get(id) as BaseRecord;

            return {
                data,
            }
        } catch (error) {
            console.error("Error in update()", error);
            return {
                data: {}
            }
        } finally {
            db.close()
        }
    },

    getOne: ({ resource, id }: GetOneParams) => {
        const db = dbConnect(dbPath);
        try {
            const stmt = db.prepare(`SELECT * FROM ${resource} WHERE id = ?`)
            const data = stmt.get(id) as BaseRecord;

            return {
                data,
            };
        } catch (error) {
            console.error("Error in getOne()", error);
            return {
                data: {}
            }
        } finally {
            db.close()
        }
    },

    deleteOne: ({ resource, id }: DeleteOneParams) => {
        const db = dbConnect(dbPath);

        try {
            const stmt = db.prepare(`DELETE FROM ${resource} WHERE id = ?`);
            const { changes } = stmt.run(id);

            if (changes !== 1) {
                throw new Error(`Failed to delete ${resource} with id ${id}`);
            }

            return {
                data: null
            }
        } catch (error) {
            console.log("Error in deleteOne()", error);
            return {
                data: null
            }
        } finally {
            db.close();
        }
    }
});
