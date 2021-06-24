import { IDBEntity } from "./IDBEntity";

export interface IDBUserAdd extends IDBEntity{
    id?: string;
    displayName: string;
    mail: string;
    principalName?: string;
    phone:string;
    employeeId?: string;
}