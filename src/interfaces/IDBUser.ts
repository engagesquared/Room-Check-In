import { IDBEntity } from "./IDBEntity";

export interface IDBUser extends IDBEntity{    
    DisplayName: string;
    PrincipalName?: string;
    Email: string;
    Phone: string;
    EmployeeId?: string;
    Id: string;
}