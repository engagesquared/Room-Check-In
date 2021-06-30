import { ILocation } from "./ILocation";
import { IDateTimeTimeZone } from "./IDateTimeTimeZone";
import { IAttendee } from "./IAttendee";

export interface IEvent {
    id: string;
    subject: string;
    end: IDateTimeTimeZone;
    start: IDateTimeTimeZone;
    bodyPreview: string;
    location: ILocation;
    attendees: IAttendee[];
    adHoc: boolean;
}