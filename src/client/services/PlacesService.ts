import {
    getRoomByDisplayName as getRoomByDisplayNameApi,
    getRoomById as getRoomByIdApi,
    getAttendees as getAttendeesApi,
    getEventByLocationId as getEventByLocationIdApi,
    getRoomLocationByEmailAddress as getRoomLocationByEmailAddressApi
} from "../apis/api-list";
import { IRoom } from '../../interfaces/IRoom';
import { IAttendee } from "../../interfaces/IAttendee";
import { IEvent } from "../../interfaces/IEvent";
import { ICheckIn } from "../../interfaces/ICheckIn";

export const getRoomByDisplayName = async (roomName: string): Promise<IRoom | undefined> => {
    try {
        const room = await getRoomByDisplayNameApi(roomName);
        return room;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getRoomById = async (roomId: string): Promise<IRoom | undefined> => {
    try {
        const room = await getRoomByIdApi(roomId);
        return room;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getRoomLocationByEmailAddress = async (emailAddress: string): Promise<string | undefined> => {
    try {
        const location = await getRoomLocationByEmailAddressApi(emailAddress);
        return location;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getAttendees = async (locationEmailAddress: string): Promise<IAttendee[]> => {
    try {
        const attendees = await getAttendeesApi(locationEmailAddress);
        return attendees;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export const getEventByLocationId = async (locationId: string): Promise<IEvent[]> => {
    try {
        const events = await getEventByLocationIdApi(locationId);
        return events;
    } catch (error) {
        console.error(error);
        return [];
    }
}

