import { GetManyParams, GetManyResponse } from "@refinedev/core";
import { Database } from "sqlite3";

type Params = Pick<GetManyParams,
    "resource" |
    "ids"
> & {
    db: Database
};

export async function getMany(params: Params): Promise<GetManyResponse> {
    const { db, resource, ids } = params;
    try {
        const data = await new Promise((resolve, reject) => {
            let idString = ids.join(", ");

            const sql = `SELECT * FROM ${resource} WHERE id IN (${idString})`;

            db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
                db.close();
            });
        }) as Array<any>

        return {
            data
        };

    } catch (error) {
        console.error("Error in getMany()", error);
        return {
            data: []
        }
    }
}
