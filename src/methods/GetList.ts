import { Database } from "sqlite3";
import { generateSort } from "src/utils/generateSort";
import { generateFilter } from "src/utils/generateFilter";
import { GetListResponse } from "@refinedev/core";
import { GetListParams } from "src/interfaces/MethodParams";

export async function getList({ resource, pagination, filters, sorters }: GetListParams): Promise<GetListResponse> {
    try {
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

        const rows = await new Promise((resolve, reject) => {
            let sql = `SELECT * FROM ${resource}`;

            if (queryFilters) {
                sql += ` WHERE ${queryFilters}`;
            }

            if (generatedSort) {
                sql += ` ORDER BY ${query._sortString}`;
            }

            if (pagination) {
                sql += ` LIMIT ${query._start}, ${query._end}`;
            }

            db.all(sql, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows);
                }
                db.close();
            });
        }) as Array<any>

        let data = rows;
        let total = rows?.length ?? 0;

        return {
            data,
            total: total || data.length
        };
    } catch (error) {
        console.error("Error in getList()", error);
        return {
            data: [],
            total: 0
        }
    }
}

