import { CreateParams, UpdateParams } from "./interfaces/MethodParams";
import Database from "./utils/Database";

import { Database as SQLiteDatabase } from "sql.js"

class Provider {
  private dbArgs: string
  private type: 'local' | 'inMemory'

  constructor(type: 'local' | 'inMemory', dbArgs: string) {
    this.dbArgs = dbArgs;
    this.type = type;
  }

  private async dbConnect(): Promise<SQLiteDatabase | void> {
    try {
      return await Database.init(this.dbArgs);
    } catch (error) {
      console.error("Error in dbConnect()", error);
    }
  }

  public async create(params: CreateParams) {
    const database = await this.dbConnect();
    const { resource, variables } = params;

    try {
      if (!database)
        throw new Error("Database connection not available.");

      const columns = Object.keys(variables).join(", ")
      const values = Object.values(variables).map((value) => `'${value}'`).join(", ")

      let insertSql = `INSERT INTO ${resource} (${columns}) VALUES (${values})`;
      let selectSql = `SELECT * FROM ${resource} WHERE (${columns}) = (${values})`;

      database.run(insertSql);
      const data = database.exec(selectSql)
      const dataColumns = data[0].columns
      const dataValues = data[0].values[0]

      if (data) {
        return {
          data: Object.fromEntries(
            dataColumns.map((col, index) => [col, dataValues[index]]),
          )
        }
      } else {
        throw new Error(`Could not create data in ${resource}`);
      }
    } catch (error) {
      console.error("Error in create()", error);
      return {
        data: {}
      }
    } finally {
      database?.close()
    }
  }

  public async update(params: UpdateParams) {
    const database = await this.dbConnect();
    const { resource, id, variables } = params;

    try {
      if (!database)
        throw new Error("Database connection not available.");

      const columns = Object.keys(variables || {});
      const values = Object.values(variables || {});

      let updateQuery = "";

      columns.forEach((column, index) => {
        updateQuery += `${column} = '${values[index]}', `;
      });

      // Slices the last comma
      updateQuery = updateQuery.slice(0, -2);

      const updateSql = `UPDATE ${resource} SET ${updateQuery} WHERE id = ${id}`;
      const selectSql = `SELECT * FROM ${resource} WHERE id = ${id}`;

      database.run(updateSql);
      const data = database.exec(selectSql)
      const dataColumns = data[0].columns
      const dataValues = data[0].values[0]

      if (data) {
        return {
          data: Object.fromEntries(
            dataColumns.map((col, index) => [col, dataValues[index]]),
          )
        }
      } else {
        throw new Error(`Could not update data in ${resource}`);
      }
    } catch (error) {
      console.error("Error in update()", error);
      return {
        data: {}
      }
    } finally {
      database?.close()
    }
  }

  // deleteOne(params: DeleteOneParams) {
  //     return DeleteOne.build(this.dbPath, params);
  // }
  //
  // getOne(params: GetOneParams) {
  //     return GetOne.build(this.dbPath, params);
  // }
  //
  // getMany(params: GetManyParams) {
  //     return GetMany.build(this.dbPath, params);
  // }
  //
  // getList(params: GetListParams) {
  //     return GetList.build(this.dbPath, params);
  // }
}

export const dataProvider = (type: 'local' | 'inMemory', dbArgs: string) => {
  return new Provider(type, dbArgs);
}

