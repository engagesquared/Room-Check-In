import { IEmailAdress } from "./IEmailAdress";
import { IResponseStatus } from "./IResponseStatus";

export interface IAttendee {
    emailAddress: IEmailAdress;
    status: IResponseStatus;
    type: string;
}