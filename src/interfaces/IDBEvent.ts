import { IAttendee } from "./IAttendee";
import { ILocation } from "./ILocation";
import { IDateTimeTimeZone } from "./IDateTimeTimeZone";

export interface IDBEvent {
    id: string;
    subject: string;
    startTime: IAttendee[];
    endTime: IDateTimeTimeZone;
    locationDisplayName: IDateTimeTimeZone;
    locationEmail: string;
}