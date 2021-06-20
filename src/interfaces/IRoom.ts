import { IAddress } from "./IAddress";
import { IGeoCoordinates } from "./IGeoCoordinates";

export interface IRoom {
    id: string;
    emailAddress: string;
    displayName: string;
    address: IAddress;
    phone: string;
    nickname: string;
    label: string;
    capacity: number;
    building: string;
    floorNumber: number;
    isManaged: boolean;
    isWheelChairAccessible: boolean;
    bookingType: string;
    geoCoordinates: IGeoCoordinates;
}