import axios from "axios";
import { ICheckIn } from "../../interfaces/ICheckIn";
import { IDBCheckIn } from "../../interfaces/IDBCheckIn";
import { IDBUser } from "../../interfaces/IDBUser";
import {
    getCheckedInUsers as getCheckedInUsersApi,
    addCheckIn as addCheckInApi,
} from "../apis/api-list";

export const getCheckedInUsers = async (roomId: string, eventId:string): Promise<IDBUser[]> => {
    try {
        const users= await getCheckedInUsersApi(roomId, eventId);
        return users;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const addCheckIn = async (checkIn:ICheckIn): Promise<string> => {
    try {
        const res: any = await addCheckInApi(checkIn);
        return res?.data;
    } catch (error) {
        console.error(error);
        return "";
    }
}