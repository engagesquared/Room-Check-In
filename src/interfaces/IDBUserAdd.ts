import { TableEntityResult } from "@azure/data-tables";
import { IDBEntity } from "./IDBEntity";

export interface IDBUserAdd extends IDBEntity{
    id?: string;
    displayName: string;
    mail: string;
    principalName?: string;
    phone?:string;
    employeeId?: string;
    external?: boolean;
}

export function instanceOfIDBUserAdd(object: TableEntityResult<Record<string, unknown>> | IDBUserAdd): object is IDBUserAdd {
    return true;
}