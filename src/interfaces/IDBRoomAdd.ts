import { IAddress } from "./IAddress";
import { IDBEntity } from "./IDBEntity";
import { IGeoCoordinates } from "./IGeoCoordinates";

export interface IDBRoomAdd extends IDBEntity {
    id: string;
    emailAddress: string;
    displayName: string;
    phone?: string;
    capacity: number;
    building?: string;
}