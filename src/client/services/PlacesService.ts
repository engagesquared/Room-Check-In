import {
    getRoomByDisplayName as getRoomByDisplayNameApi,
    getRoomById as getRoomByIdApi,
    getRoomByEmailAddress as getRoomByEmailAddressApi
} from "../apis/api-list";
import { IRoom } from '../../interfaces/IRoom';

export const getRoomById = async (roomId: string): Promise<IRoom | undefined> => {
    try {
        const room = await getRoomByIdApi(roomId);
        return room;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getRoomByDisplayName = async (roomName: string): Promise<IRoom | undefined> => {
    try {
        const room = await getRoomByDisplayNameApi(roomName);
        return room;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getRoomByEmailAddress = async (emailAddress: string): Promise<string | undefined> => {
    try {
        const location = await getRoomByEmailAddressApi(emailAddress);
        return location;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

