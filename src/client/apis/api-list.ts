import axios from 'axios';
import { IUser } from '../../interfaces/IUser';
import { IRoom } from '../../interfaces/IRoom';
import { IEvent } from '../../interfaces/IEvent';
import { IAttendee } from '../../interfaces/IAttendee';
import { ICheckIn } from "../../interfaces/ICheckIn";
import { IDBCheckIn } from "../../interfaces/IDBCheckIn";
import { IDBUser } from "../../interfaces/IDBUser";

// users APIs [START]
export const getLoggedInUser = async (): Promise<IUser | undefined> => {
    const userRes = await axios.get("/api/users/me");
    const user: IUser | undefined = userRes.data;
    return user;
}

export const getAllUsers = async (): Promise<IUser[] | undefined> => {
    const usersRes = await axios.get("/api/users/all");
    const users: IUser[] | undefined = usersRes.data;
    return users;
}

export const getAllUsersMembersOnly = async (): Promise<IUser[] | undefined> => {
    const usersRes = await axios.get("/api/users/membersOnly");
    const users: IUser[] | undefined = usersRes.data;
    return users;
}

export const getAllUsersGuestsOnly = async (): Promise<IUser[] | undefined> => {
    const usersRes = await axios.get("/api/users/guestsOnly");
    const users: IUser[] | undefined = usersRes.data;
    return users;
}

export const getUserById = async (id:string): Promise<IUser | undefined> => {
    const userDetailsRes = await axios.get(`/api/users/${id}`);
    const userDetails: IUser | undefined = userDetailsRes.data;
    return userDetails;
}

export const getUserByDisplayName = async (displayName: string): Promise<IUser | undefined> => {
    const userDetailsRes = await axios.get(`/api/users/byDisplayName/${displayName}`);
    const userDetails: IUser | undefined = userDetailsRes.data;
    return userDetails;
}

export const getUserByPrincipalName = async (upn:string): Promise<IUser | undefined> => {
    const userDetailsRes = await axios.get(`/api/users/byUserPrincipalName/upn=${upn}`);
    const userDetails: IUser | undefined = userDetailsRes.data;
    return userDetails;
}

// users APIs [END]

// places APIs [START]
export const getRoomById = async (id: string): Promise<IRoom | undefined> => {
    const roomRes = await axios.get(`/api/places/${id}`);
    const room: IRoom = roomRes.data;
    return room;
}

export const getRoomByDisplayName = async (displayName: string): Promise<IRoom | undefined> => {
    const roomRes = await axios.get(`/api/places/byDisplayName/${displayName}`);
    const room: IRoom = roomRes.data;
    return room;
}

export const getRoomByEmailAddress = async (emailAddress: string): Promise<string | undefined> => {
    const roomLocationRes = await axios.get(`/api/places/byEmailAdress/${emailAddress}`);
    const roomLocation: string = roomLocationRes.data;
    return roomLocation;
}
// places APIs [END]

// events APIs [START]
export const getMyEventId = async (eventId: string) => {
    const eventRes = await axios.get(`/api/me/events/${eventId}`);
    const event: IEvent = eventRes.data;
    return event;
}


export const getMyNextEventByLocationDisplayName = async (locationDisplayName: string): Promise<IEvent> => {
    const eventsRes = await axios.get(`/api/me/events/byLocationDisplayName/${locationDisplayName}`);
    const events: IEvent = eventsRes.data;
    return events;
}

export const getMyNextEventByLocationEmailAddress = async (locationEmailAdress: string): Promise<IEvent> => {
    const eventsRes = await axios.get(`/api/me/events/byLocationEmailAdress/${locationEmailAdress}`);
    const events: IEvent = eventsRes.data;
    return events;
}
// events APIs [END]

// data-table APIs [START]
export const getCheckedInUsers = async (roomId:string, eventId: string) => {
    const checkedInUsersRes = await axios.get(`/api/users/checkedIn/${roomId}/${eventId}`);
    const checkedInUsers: IDBUser[] = checkedInUsersRes.data;
    return checkedInUsers;
}

export const addCheckIn = async (checkIn: ICheckIn) => {
    const checkInRes = await axios.post(`/api/users/checkIn`,checkIn);
    const checkInAdded: string = checkInRes.data;
    return checkInAdded;
}
// data-table APIs [END]