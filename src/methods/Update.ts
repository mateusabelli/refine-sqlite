import { UpdateParams, UpdateResponse } from "@refinedev/core";
import { Database } from "sqlite3";

type Params = Pick<UpdateParams,
    "resource" |
    "id" |
    "variables"
> & {
    db: Database
};

export async function update(params: Params): Promise<UpdateResponse> {
    const { db, resource, id, variables } = params;
    try {
        const data = await new Promise((resolve, reject) => {
            const columns = Object.keys(variables || {});
            const values = Object.values(variables || {});

            let updateQuery = "";

            columns.forEach((column, index) => {
                updateQuery += `${column} = '${values[index]}', `;
            });

            // Slices the last comma
            updateQuery = updateQuery.slice(0, -2);

            let sql = `UPDATE ${resource} SET ${updateQuery} WHERE id = ${id}`;

            db.serialize(() => {
                db.run(sql, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                sql = `SELECT * FROM ${resource} WHERE id = ${id}`;
                db.get(sql, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
                db.close();
            });
        }) as any;

        return {
            data
        }
    } catch (error) {
        console.error("Error in update()", error);
        return {
            data: {}
        }
    }
}

