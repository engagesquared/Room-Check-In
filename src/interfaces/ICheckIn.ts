import { IEvent } from "./IEvent";
import { IRoom } from "./IRoom";
import { IUser } from "./IUser";

export interface ICheckIn {
    user:IUser;
    room:IRoom;
    event:IEvent;
}