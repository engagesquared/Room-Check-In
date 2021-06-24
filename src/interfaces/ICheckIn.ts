import { IUserAdd } from "./IUserAdd";
import { IRoomAdd } from "./IRoomAdd";
import { IEventAdd } from "./IEventAdd";

export interface ICheckIn {
    users:IUserAdd[];
    room:IRoomAdd;
    event:IEventAdd;
}