import {
    getMyEventId as getMyEventIdApi,
    getMyNextEventByLocationDisplayName as getMyNextEventByLocationDisplayNameApi,
    getMyNextEventByLocationEmailAddress as getMyNextEventByLocationEmailAddressApi,
} from "../apis/api-list";
import { IAttendee } from "../../interfaces/IAttendee";
import { IEvent } from "../../interfaces/IEvent";
import { ICheckIn } from "../../interfaces/ICheckIn";

export const getMyEventById = async (eventId: string): Promise<IEvent | undefined> => {
    try {
        const event = await getMyEventIdApi(eventId);
        return event;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getMyNextEventByLocationDisplayName = async (locationDisplayName: string): Promise<IEvent | undefined> => {
    try {
        const event = await getMyNextEventByLocationDisplayNameApi(locationDisplayName);
        return event;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getMyNextEventByLocationEmailAddress = async (locationEmailAdress: string): Promise<IEvent | undefined> => {
    try {
        const event = await getMyNextEventByLocationEmailAddressApi(locationEmailAdress);
        return event;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}



