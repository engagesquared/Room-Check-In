import axios from 'axios';
import { IUser } from '../../interfaces/IUser';
import { IRoom } from '../../interfaces/IRoom';
import { IEvent } from '../../interfaces/IEvent';
import { IAttendee } from '../../interfaces/IAttendee';
import { ICheckIn } from "../../interfaces/ICheckIn";
import { IDBCheckIn } from "../../interfaces/IDBCheckIn";
import { IDBUser } from "../../interfaces/IDBUser";

export const getLoggedInUserDetails = async (): Promise<IUser | undefined> => {
    const userDetailsRes = await axios.get("/api/loggedInUserDetails");
    const userDetails: IUser | undefined = userDetailsRes.data;
    return userDetails;
}

export const getUserDetailsById = async (id:string): Promise<IUser | undefined> => {
    const userDetailsRes = await axios.get(`/api/userDetailsById?userId=${id}`);
    const userDetails: IUser | undefined = userDetailsRes.data;
    return userDetails;
}

export const getUserDetailsByPrincipalName = async (upn:string): Promise<IUser | undefined> => {
    const userDetailsRes = await axios.get(`/api/userDetailsByPrincipalName?upn=${upn}`);
    const userDetails: IUser | undefined = userDetailsRes.data;
    return userDetails;
}

export const getUserDetailsByDisplayName = async (displayName: string): Promise<IUser | undefined> => {
    const userDetailsRes = await axios.get(`/api/userDetailsByDisplayName?displayName=${displayName}`);
    const userDetails: IUser | undefined = userDetailsRes.data;
    return userDetails;
}

export const getRoomById = async (id: string): Promise<IRoom | undefined> => {
    const roomRes = await axios.get(`/api/roomById?roomId=${id}`);
    const room: IRoom = roomRes.data;
    return room;
}

export const getRoomByDisplayName = async (displayName: string): Promise<IRoom | undefined> => {
    const roomRes = await axios.get(`/api/roomByDisplayName?displayName=${displayName}`);
    const room: IRoom = roomRes.data;
    return room;
}

export const getRoomLocationByEmailAddress = async (emailAddress: string): Promise<string | undefined> => {
    const roomLocationRes = await axios.get(`/api/roomLocationByEmailAddress?emailAddress=${emailAddress}`);
    const roomLocation: string = roomLocationRes.data;
    return roomLocation;
}

export const getAttendees = async (emailAddress: string): Promise<IAttendee[]> => {
    const attendeesRes = await axios.get(`/api/myEventIAttendeesByLocationEmailAddress?locationEmailAddress=${emailAddress}`);
    const attendees: IAttendee[] = attendeesRes.data;
    return attendees;
}

export const getEventByLocationId = async (locationId: string): Promise<IEvent[]> => {
    const eventsRes = await axios.get(`/api/myEventByLocationId?locationId=${locationId}`);
    const events: IEvent[] = eventsRes.data;
    return events;
}

export const getMyEventDetailsId = async (eventId: string) => {
    const eventRes = await axios.get(`/api/myEventDetailsId?eventId=${eventId}`);
    const event: IEvent = eventRes.data;
    return event;
}

export const getCheckedInUsers = async (roomId:string, eventId: string) => {
    const eventRes = await axios.get(`/api/checkedInUsers?roomId=${roomId}&eventId=${eventId}`);
    const event: IDBUser[] = eventRes.data;
    return event;
}

export const addCheckIn = async (checkIn: ICheckIn) => {
    const checkInRes = await axios.post(`/api/checkIn`,checkIn);
    const checkInAdded: IDBCheckIn = checkInRes.data;
    return checkInAdded;
}