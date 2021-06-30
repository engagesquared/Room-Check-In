import { ILocation } from "./ILocation";
import { IDateTimeTimeZone } from "./IDateTimeTimeZone";
import { IAttendee } from "./IAttendee";
import { IDBEntity } from "./IDBEntity";
import { TableEntityResult } from "@azure/data-tables";

export interface IDBEventAdd extends IDBEntity {
    id?: string;
    subject?: string;
    start?: string;
    end?: string;
    locationDisplayName: string;
    locationEmail: string;
    adHoc?: boolean;
}

export function instanceOfIDBEventAdd(object: TableEntityResult<Record<string, unknown>> | IDBEventAdd): object is IDBEventAdd {
    return true;
}