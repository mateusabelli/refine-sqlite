import { AxiosInstance } from "axios";
import { stringify } from "query-string";
import { DataProvider } from "@refinedev/core";
import { axiosInstance, generateSort, generateFilter } from "./utils";
import sqlite3 from "sqlite3";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

export const dataProvider = (
    apiUrl: string,
    // httpClient: AxiosInstance = axiosInstance,
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
            // const url = `${apiUrl}/${resource}`;

            const {
                current = 1,
                pageSize = 10,
                mode = "server",
            } = pagination ?? {};

            // const { headers: headersFromMeta, method } = meta ?? {};
            // const requestMethod = (method as MethodTypes) ?? "get";
            //
            const queryFilters = generateFilter(filters);

            const query: {
                _start?: number;
                _end?: number;
                _sortString?: string;
            } = {};

            if (mode === "server") {
                query._start = (current - 1) * pageSize;
                query._end = current * pageSize;
            }

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

    // TODO: Test this function
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

    // TODO: Test this function
    create: async ({ resource, variables, meta }) => {
        try {
            const db = new sqlite3.Database(apiUrl);

            const data = await new Promise((resolve, reject) => {
                const columns = Object.keys(variables || {}).join(", ")
                const values = Object.values(variables || {}).join(", ")

                const sql = `INSERT INTO ${resource} (${columns}) VALUES (${values})`

                db.get(sql, (err, row) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row);
                    }
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
                data
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

    // TODO: Test this function
    deleteOne: async ({resource, id, variables, meta}) => {
        try {
            const db = new sqlite3.Database(apiUrl);

            const data = await new Promise((resolve, reject) => {
                const sql = `DELETE FROM ${resource} WHERE id = ${id}`;

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
            // const requestMethod = (method as MethodTypesWithBody) ?? "delete";
            //
            // const { data } = await httpClient[requestMethod](url, {
            //     data: variables,
            //     headers,
            // });

            return {
                data,
            };

        } catch (error) {
            console.error("Error in deleteOne()", error);
            return {
                data: null
            }
        }
    },


    getApiUrl: () => {
        return apiUrl;
    },

    // custom: async ({
    //     url,
    //     method,
    //     filters,
    //     sorters,
    //     payload,
    //     query,
    //     headers,
    // }) => {
    //     let requestUrl = `${url}?`;
    //
    //     if (sorters) {
    //         const generatedSort = generateSort(sorters);
    //         if (generatedSort) {
    //             const { _sort, _order } = generatedSort;
    //             const sortQuery = {
    //                 _sort: _sort.join(","),
    //                 _order: _order.join(","),
    //             };
    //             requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
    //         }
    //     }
    //
    //     if (filters) {
    //         const filterQuery = generateFilter(filters);
    //         requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    //     }
    //
    //     if (query) {
    //         requestUrl = `${requestUrl}&${stringify(query)}`;
    //     }
    //
    //     if (headers) {
    //         httpClient.defaults.headers = {
    //             ...httpClient.defaults.headers,
    //             ...headers,
    //         };
    //     }
    //
    //     let axiosResponse;
    //     switch (method) {
    //         case "put":
    //         case "post":
    //         case "patch":
    //             axiosResponse = await httpClient[method](url, payload);
    //             break;
    //         case "delete":
    //             axiosResponse = await httpClient.delete(url, {
    //                 data: payload,
    //             });
    //             break;
    //         default:
    //             axiosResponse = await httpClient.get(requestUrl);
    //             break;
    //     }
    //
    //     const { data } = axiosResponse;
    //
    //     return Promise.resolve({ data });
    // },
});
