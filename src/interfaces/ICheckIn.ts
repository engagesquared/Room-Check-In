import { IEvent } from "./IEvent";
import { IRoom } from "./IRoom";
import { IUser } from "./IUser";

export interface ICheckIn {
    users:IUser[];
    room:IRoom;
    event:IEvent;
}