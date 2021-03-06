import { IAttendee } from "./IAttendee";
import { ILocation } from "./ILocation";
import { IDateTimeTimeZone } from "./IDateTimeTimeZone";
import { IDBEntity } from "./IDBEntity";

export interface IDBEvent extends IDBEntity{
    id: string;
    subject: string;
    start: string;
    end: string;
    locationDisplayName: string;
    locationEmail: string;
}