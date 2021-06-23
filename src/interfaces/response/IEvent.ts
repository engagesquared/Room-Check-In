import { IAttendee } from "./IAttendee";
import { ILocation } from "./ILocation";
import { IDateTimeTimeZone } from "./IDateTimeTimeZone";

export interface IEvent {
    subject: string;
    attendees: IAttendee[];
    end: IDateTimeTimeZone;
    start: IDateTimeTimeZone;
    bodyPreview: string;
    location: ILocation;
}