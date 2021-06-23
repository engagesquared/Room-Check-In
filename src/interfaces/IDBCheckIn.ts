import { IDBEntity } from "./IDBEntity";

export interface IDBCheckIn extends IDBEntity{    
    EventId:string;
    RoomId:string;
    UserDisplayName: string;
    UserId: string
}