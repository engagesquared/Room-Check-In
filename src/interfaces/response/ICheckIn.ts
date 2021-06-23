import { IRoom } from "./IRoom";
import { IUser } from "./IUser";
import { IEvent } from "./IEvent";

export interface ICheckIn {
    user:IUser;
    room:IRoom;
    event: IEvent
}