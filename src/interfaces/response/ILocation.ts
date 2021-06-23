import { IAddress } from "./IAddress";
import { IGeoCoordinates } from "./IGeoCoordinates";

export interface ILocation {
    address: IAddress,
    coordinates: IGeoCoordinates,
    displayName: string;
    locationEmailAddress: string;
    locationUri: string;
    locationType: string;
    uniqueId: string;
    uniqueIdType: string;
  }