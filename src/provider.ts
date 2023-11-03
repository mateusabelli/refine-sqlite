import { CreateParams, DeleteOneParams, GetListParams, GetManyParams, GetOneParams, UpdateParams } from "./interfaces/MethodParams";

import GetOne from "./methods/GetOne";
import Create from "./methods/Create";
import DeleteOne from "./methods/DeleteOne";
import GetMany from "./methods/GetMany";
import Update from "./methods/Update";
import GetList from "./methods/GetList";

class Provider {
    private dbPath: string;

    constructor(dbPath: string) {
        this.dbPath = dbPath;
    }

    create(params: CreateParams) {
        return Create.build(this.dbPath, params)
    }

    update(params: UpdateParams) {
        return Update.build(this.dbPath, params)
    }

    deleteOne(params: DeleteOneParams) {
        return DeleteOne.build(this.dbPath, params);
    }

    getOne(params: GetOneParams) {
        return GetOne.build(this.dbPath, params);
    }

    getMany(params: GetManyParams) {
        return GetMany.build(this.dbPath, params);
    }

    getList(params: GetListParams) {
        return GetList.build(this.dbPath, params);
    }
}

export const dataProvider = (dbPath: string) => {
    return new Provider(dbPath);
};

