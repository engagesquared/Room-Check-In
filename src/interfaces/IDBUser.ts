import { IDBEntity } from "./IDBEntity";

export interface IDBUser extends IDBEntity{    
    displayName: string;
    principalName?: string;
    mail: string;
    phone: string;
    employeeId?: string;
    id?: string;
}