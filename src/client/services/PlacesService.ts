import { constants } from "../../constants";
import axios from "axios";
import { IRoom } from '../../interfaces/IRoom';
import { IAttendee } from "../../interfaces/IAttendee";
import { IEvent } from "../../interfaces/IEvent";
import { ICheckIn } from "../../interfaces/ICheckIn";
import { getClientSideToken } from "./AuthService";


export const getRoomByDisplayName = async (roomName: string): Promise<IRoom | undefined> => {
    try {
        const clientSideToken = await getClientSideToken();
        const res: any = await axios.get(`/api/roomByDisplayName?roomId=${roomName}`
            , { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getRoomById = async (roomId: string): Promise<IRoom | undefined> => {
    try {
        const clientSideToken = await getClientSideToken();
        const res: any = await axios.get(`/api/placeById?roomId=${roomId}`
            , { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getColleagues = async (locationEmailAddress: string): Promise<IAttendee[]> => {
    try {
        const clientSideToken = await getClientSideToken();
        const res: any = await axios.get(`/api/myEventByLocationEmailAddress?locationEmailAddress=${locationEmailAddress}`
            , { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export const getEventByLocationId = async (locationId: string): Promise<IEvent[]> => {
    try {
        const clientSideToken = await getClientSideToken();
        const res: any = await axios.get(`/api/myEventByLocationId?locationId=${locationId}`
            , { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const checkInUser = async (checkInObject: ICheckIn): Promise<void> => {
    try {
        const clientSideToken = await getClientSideToken();
        const res: any = await axios.post(`/api/checkIn`, checkInObject,
            { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
    } catch (error) {
        console.error(error);
    }
}

