import { constants } from "../../constants";
import axios from "axios";
import { ICheckIn } from "../../interfaces/ICheckIn";
import { IDBCheckIn } from "../../interfaces/IDBCheckIn";

export const addCheckIns = async (checkIn:ICheckIn[]): Promise<IDBCheckIn []> => {
    try {
        const res: any = await axios.post(`/api/checkIns`, checkIn, { headers: { 'Content-Type':'application/json' } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}