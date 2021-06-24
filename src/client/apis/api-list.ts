import axiosDecorator from "./axiosDecorator";
import { IUser } from '../../interfaces/IUser';
import { IRoom } from '../../interfaces/IRoom';
import { IEvent } from '../../interfaces/IEvent';
import { IAttendee } from '../../interfaces/IAttendee';
import { ICheckIn } from "../../interfaces/ICheckIn";
import { IDBCheckIn } from "../../interfaces/IDBCheckIn";

export const getLoggedInUserDetails = async () => {
    const userDetailsRes = await axiosDecorator.get("/api/loggedInUserDetails");
    const userDetails: IUser = userDetailsRes.data;
    return userDetails;
}

export const getUserDetailsById = async (id:string) => {
    const userDetailsRes = await axiosDecorator.get(`/api/userDetailsById?userId=${id}`);
    const userDetails: IUser = userDetailsRes.data;
    return userDetails;
}

export const getUserDetailsByPrincipalName = async (upn:string) => {
    const userDetailsRes = await axiosDecorator.get(`/api/userDetailsByPrincipalName?upn=${upn}`);
    const userDetails: IUser = userDetailsRes.data;
    return userDetails;
}

export const getRoomById = async (id: string) => {
    const roomRes = await axiosDecorator.get(`/api/roomById?roomId=${id}`);
    const room: IRoom = roomRes.data;
    return room;
}

export const getRoomByDisplayName = async (displayName: string) => {
    const roomRes = await axiosDecorator.get(`/api/roomByDisplayName?displayName=${displayName}`);
    const room: IRoom = roomRes.data;
    return room;
}

export const getRoomLocationByEmailAddress = async (emailAddress: string) => {
    const roomLocationRes = await axiosDecorator.get(`/api/roomLocationByEmailAddress?emailAddress=${emailAddress}`);
    const roomLocation: string = roomLocationRes.data;
    return roomLocation;
}

export const getMyEventAttendeesByLocationEmailAddress = async (emailAddress: string) => {
    const attendeesRes = await axiosDecorator.get(`/api/myEventAttendeesByLocationEmailAddress?locationEmailAddress=${emailAddress}`);
    const attendees: IAttendee[] = attendeesRes.data;
    return attendees;
}

export const getMyEventByLocationId = async (locationId: string) => {
    const eventsRes = await axiosDecorator.get(`/api/myEventByLocationId?locationId=${locationId}`);
    const events: IEvent[] = eventsRes.data;
    return events;
}

export const getMyEventDetailsId = async (eventId: string) => {
    const eventRes = await axiosDecorator.get(`/api/myEventDetailsId?eventId=${eventId}`);
    const event: IEvent = eventRes.data;
    return event;
}

export const addCheckIns = async (checkIns: ICheckIn[]) => {
    const checkInsRes = await axiosDecorator.post(`/api/checkIns`,checkIns);
    const checkInsAdded: IDBCheckIn[] = checkInsRes.data;
    return checkInsAdded;
}