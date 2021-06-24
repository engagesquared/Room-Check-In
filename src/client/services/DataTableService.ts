import axios from "axios";
import { ICheckIn } from "../../interfaces/ICheckIn";
import { IDBCheckIn } from "../../interfaces/IDBCheckIn";
import { IDBUser } from "../../interfaces/IDBUser";
import {
    getCheckedInUsers as getCheckedInUsersApi,
    addCheckIn as addCheckInApi,
} from "../apis/api-list";

export const addCheckIn = async (checkIn:ICheckIn): Promise<IDBCheckIn []> => {
    try {
        const res: any = await addCheckInApi(checkIn);
        return res?.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getCheckedInUsers = async (roomId: string, eventId:string): Promise<IDBUser | undefined> => {
    try {
        const res: any = await getCheckedInUsersApi(roomId, eventId);
        return res?.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}