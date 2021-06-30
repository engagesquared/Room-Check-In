import { TableEntityResult } from "@azure/data-tables";
import { IDBEntity } from "./IDBEntity";

export interface IDBRoomAdd extends IDBEntity {
    id: string;
    emailAddress: string;
    displayName: string;
    phone?: string;
    capacity: number;
    building?: string;
}

export function instanceOfIDBRoomAdd(object: TableEntityResult<Record<string, unknown>> | IDBRoomAdd): object is IDBRoomAdd {
    return true;
}