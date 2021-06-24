import { ILocation } from "./ILocation";
import { IDateTimeTimeZone } from "./IDateTimeTimeZone";
import { IAttendee } from "./IAttendee";
import { IDBEntity } from "./IDBEntity";

export interface IDBEventAdd extends IDBEntity {
    id: string;
    subject: string;
    start: string;
    end: string;
    locationDisplayName: string;
    locationEmail: string;
}