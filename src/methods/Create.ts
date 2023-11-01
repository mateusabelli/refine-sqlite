import { CreateParams, CreateResponse } from "@refinedev/core";
import { Database } from "sqlite3";

type Params = Pick<CreateParams,
    "resource" |
    "variables"
> & {
    db: Database
};

export async function create(params: Params): Promise<CreateResponse> {
    const { db, resource, variables } = params;
    try {
        const data = await new Promise((resolve, reject) => {
            const columns = Object.keys(variables || {})
                .join(", ")
            const values = Object.values(variables || {})
                .map((value) => `'${value}'`).join(", ")

            let sql = `INSERT INTO ${resource} (${columns}) VALUES (${values})`;

            db.serialize(() => {
                db.run(sql, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
                sql = `SELECT * FROM ${resource} WHERE (${columns}) = (${values})`;
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
        };
    } catch (error) {
        console.error("Error in create()", error);
        return {
            data: {}
        }
    }
}

