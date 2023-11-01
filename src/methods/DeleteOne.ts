import { DeleteOneParams, DeleteOneResponse } from "@refinedev/core";
import { Database } from "sqlite3";

// type Params = Pick<DeleteOneParams,
//     "resource" |
//     "id"
// > & {
//     db: Database
// };

export async function deleteOne({ db, resource, id }: Pick<DeleteOneParams,
    "resource" |
    "id"
> & {
    db: Database
}): Promise<DeleteOneResponse> {
    try {
        const data = await new Promise((resolve, reject) => {
            let sql = `DELETE FROM ${resource} WHERE id = ${id}`;

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
        }) as any

        if (data) {
            throw new Error("The row was not deleted");
        }

        return {
            data: data ?? {}
        }
    } catch (error) {
        console.error("Error in deleteOne()", error);
        return {
            data: {}
        }
    }
}

