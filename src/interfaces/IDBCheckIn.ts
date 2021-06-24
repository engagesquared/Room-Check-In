import { IDBEntity } from "./IDBEntity";

export interface IDBCheckIn extends IDBEntity{
    userId:string;
    roomId:string;
    eventId:string;
}