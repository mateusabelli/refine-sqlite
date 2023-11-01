import {
    BaseRecord,
    CreateManyResponse,
    CreateResponse,
    DeleteManyResponse,
    DeleteOneResponse,
    GetListResponse,
    GetManyResponse,
    GetOneResponse,
    UpdateManyResponse,
    UpdateResponse
} from "@refinedev/core";

import {
    CreateManyParams,
    CreateParams,
    DeleteManyParams,
    DeleteOneParams,
    GetListParams,
    GetManyParams,
    GetOneParams,
    UpdateManyParams,
    UpdateParams,
} from "./MethodParams";

export interface DataProvider {
    // getList: <TData extends BaseRecord = BaseRecord>(
    //     params: GetListParams,
    // ) => Promise<GetListResponse<TData>>;
    //
    // getMany?: <TData extends BaseRecord = BaseRecord>(
    //     params: GetManyParams,
    // ) => Promise<GetManyResponse<TData>>;

    getOne: <TData extends BaseRecord = BaseRecord>(
        params: GetOneParams,
    ) => Promise<GetOneResponse<TData>>;

    // create: <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    //     params: CreateParams<TVariables>,
    // ) => Promise<CreateResponse<TData>>;
    
    // createMany?: <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    //     params: CreateManyParams<TVariables>,
    // ) => Promise<CreateManyResponse<TData>>;
    //
    // update: <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    //     params: UpdateParams<TVariables>,
    // ) => Promise<UpdateResponse<TData>>;
    //
    // updateMany?: <TData extends BaseRecord = BaseRecord, TVariables = {}>(
    //     params: UpdateManyParams<TVariables>,
    // ) => Promise<UpdateManyResponse<TData>>;
    //
    // deleteOne: <TData extends BaseRecord = BaseRecord>(
    //     params: DeleteOneParams,
    // ) => Promise<DeleteOneResponse<TData>>;
    //
    // deleteMany?: <TData extends BaseRecord = BaseRecord>(
    //     params: DeleteManyParams,
    // ) => Promise<DeleteManyResponse<TData>>;
    //
    // getApiUrl: () => string;
}
