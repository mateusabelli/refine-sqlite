import { GetListParams as RefineGetListParams } from "@refinedev/core";
import { GetManyParams as RefineGetManyParams } from "@refinedev/core";
import { GetOneParams as RefineGetOneParams } from "@refinedev/core";
import { CreateParams as RefineCreateParams } from "@refinedev/core";
import { CreateManyParams as RefineCreateManyParams } from "@refinedev/core";
import { UpdateParams as RefineUpdateParams } from "@refinedev/core";
import { UpdateManyParams as RefineUpdateManyParams } from "@refinedev/core";
import { DeleteOneParams as RefineDeleteOneParams } from "@refinedev/core";
import { DeleteManyParams as RefineDeleteManyParams } from "@refinedev/core";

export interface GetListParams extends Pick<RefineGetListParams,
    "resource" |
    "pagination" |
    "filters" |
    "sorters"
> { }

export interface GetManyParams extends Pick<RefineGetManyParams,
    "resource" |
    "ids"
> { }

export interface GetOneParams extends Pick<RefineGetOneParams,
    "resource" |
    "id"
> { }

export interface CreateParams<TVariables = {}> extends Pick<RefineCreateParams,
    "resource"
> {
    variables: TVariables
}

export interface CreateManyParams<TVariables = {}> extends Pick<RefineCreateManyParams,
    "resource"
> {
    variables: TVariables
}

export interface UpdateParams<TVariables = {}> extends Pick<RefineUpdateParams,
    "resource" |
    "id"
> {
    variables: TVariables
}

export interface UpdateManyParams<TVariables = {}> extends Pick<RefineUpdateManyParams,
    "resource" |
    "ids"
> {
    variables: TVariables
}

export interface DeleteOneParams extends Pick<RefineDeleteOneParams,
    "resource" |
    "id"
> { }

export interface DeleteManyParams extends Pick<RefineDeleteManyParams,
    "resource" |
    "ids"
> { }
