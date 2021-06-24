import { constants } from "../../constants";
import axios from "axios";
import { ICheckIn } from "../../interfaces/ICheckIn";
import { IDBCheckIn } from "../../interfaces/IDBCheckIn";
import { IDBUser } from "../../interfaces/IDBUser";

export const addCheckIn = async (checkIn:ICheckIn): Promise<IDBCheckIn []> => {
    try {
        const res: any = await axios.post(`/api/checkIn`, checkIn, { headers: { 'Content-Type':'application/json' } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getCheckedInUsers = async (roomId: string, eventId:string): Promise<IDBUser | undefined> => {
    try {
        const res: any = await axios.get(`/api/checkedInUsers?roomId=${roomId}&eventId=${eventId}`);
        return res?.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}