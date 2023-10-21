import { DataProvider } from "@refinedev/core";
import { generateSort, generateFilter } from "./utils";
import sqlite3 from "sqlite3";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

export const dataProvider = (
    apiUrl: string
): Omit<
    Required<DataProvider>,
    "createMany" |
    "updateMany" |
    "deleteMany" |
    "custom"
> => ({
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
        try {
            const db = new sqlite3.Database(apiUrl);

            const {
                current = 1,
                pageSize = 10,
            } = pagination ?? {};

            // const { headers: headersFromMeta, method } = meta ?? {};
            // const requestMethod = (method as MethodTypes) ?? "get";

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

            // const { data, headers } = await httpClient[requestMethod](
            //     `${url}?${stringify(query)}&${stringify(queryFilters)}`,
            //     {
            //         headers: headersF1romMeta,
            //     },
            // );
            //
            // const total = +headers["x-total-count"];

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
                total: total || data.length,
            };
        } catch (error) {
            console.error("Error in getList()", error);
            return {
                data: [],
                total: 0,
            }
        }
    },

    getMany: async ({ resource, ids, meta }) => {
        try {
            const db = new sqlite3.Database(apiUrl);

            const data = await new Promise((resolve, reject) => {
                let idString = ids.join(", ")

                const sql = `SELECT * FROM ${resource} WHERE id IN (${idString})`;

                db.all(sql, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows);
                    }
                    db.close();
                });
            }) as Array<any>

            // const { headers, method } = meta ?? {};
            // const requestMethod = (method as MethodTypes) ?? "get";
            //
            // const { data } = await httpClient[requestMethod](
            //     `${apiUrl}/${resource}?${stringify({ id: ids })}`,
            //     { headers },
            // );

            return {
                data,
            };

        } catch (error) {
            console.error("Error in getMany()", error);
            return {
                data: [],
            }
        }
    },

    create: async ({ resource, variables, meta }) => {
        try {
            const db = new sqlite3.Database(apiUrl);

            const data = await new Promise((resolve, reject) => {
                const columns = Object.keys(variables || {}).join(", ")
                const values = Object.values(variables || {}).map((value) => `'${value}'`).join(", ")

                let sql = `INSERT INTO ${resource} (${columns}) VALUES (${values})`
                // Sample output of sql: INSERT INTO posts (id, title) VALUES ('1001', 'foo')

                db.serialize(() => {
                    db.run(sql, (err) => {
                        if (err) {
                            reject(err)
                        }
                    });
                    sql = `SELECT * FROM ${resource} WHERE (${columns}) = (${values})`;
                    db.get(sql, (err, row) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(row);
                        }
                    });
                    db.close();
                });
            }) as any;

            // const { headers, method } = meta ?? {};
            // const requestMethod = (method as MethodTypesWithBody) ?? "post";
            //
            // const { data } = await httpClient[requestMethod](url, variables, {
            //     headers,
            // });

            return {
                data,
            };
        } catch (error) {
            console.error("Error in create()", error);
            return {
                data: null
            }
        }
    },

    update: async ({ resource, id, variables, meta }) => {
        let updateQuery = "";
        try {
            const db = new sqlite3.Database(apiUrl);

            const data = await new Promise((resolve, reject) => {
                const columns = Object.keys(variables || {})
                const values = Object.values(variables || {});

                columns.forEach((column, index) => {
                    updateQuery += `${column} = '${values[index]}', `;
                });

                // Slices the last comma
                updateQuery = updateQuery.slice(0, -2);

                let sql = `UPDATE ${resource} SET ${updateQuery} WHERE id = ${id}`;

                db.serialize(() => {
                    db.run(sql, (err) => {
                        if (err) {
                            reject(err)
                        }
                    });
                    sql = `SELECT * FROM ${resource} WHERE id = ${id}`;
                    db.get(sql, (err, row) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(row);
                        }
                    });
                    db.close();
                });
            }) as any;

            // const { headers, method } = meta ?? {};
            // const requestMethod = (method as MethodTypesWithBody) ?? "patch";
            //
            // const { data } = await httpClient[requestMethod](url, variables, {
            //     headers,
            // });

            return {
                data,
            }
        } catch (error) {
            console.error("Error in update()", error);
            return {
                data: null
            }
        }
    },

    getOne: async ({ resource, id, meta }) => {
        try {
            const db = new sqlite3.Database(apiUrl);

            const data = await new Promise((resolve, reject) => {
                const sql = `SELECT * FROM ${resource} WHERE id = ${id}`;

                db.get(sql, (err, row) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row);
                    }
                    db.close();
                });
            }) as any

            // const { headers, method } = meta ?? {};
            // const requestMethod = (method as MethodTypes) ?? "get";

            // const { data } = await httpClient[requestMethod](url, { headers });

            return {
                data,
            };
        } catch (error) {
            console.error("Error in getOne()", error);
            return {
                data: null
            }
        }
    },

    deleteOne: async ({resource, id, variables, meta}) => {
        try {
            const db = new sqlite3.Database(apiUrl);

            const data = await new Promise((resolve, reject) => {
                let sql = `DELETE FROM ${resource} WHERE id = ${id}`;

                db.serialize(() => {
                    db.run(sql, (err) => {
                        if (err) {
                            reject(err)
                        }
                    });
                    sql = `SELECT * FROM ${resource} WHERE id = ${id}`;
                    db.get(sql, (err, row) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(row);
                        }
                    });
                    db.close();
                });
            }) as any

            // const { headers, method } = meta ?? {};
            // const requestMethod = (method as MethodTypesWithBody) ?? "delete";
            //
            // const { data } = await httpClient[requestMethod](url, {
            //     data: variables,
            //     headers,
            // });

            if (data) {
                throw new Error("The row was not deleted");
            }

            return {
                data: data ?? null,
            }
        } catch (error) {
            console.error("Error in deleteOne()", error);
            return {
                data: undefined
            }
        }

    },

    getApiUrl: () => {
        return apiUrl;
    }
});
