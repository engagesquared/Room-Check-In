import { IUser } from '../../interfaces/IUser';
import {
    getLoggedInUserDetails as getLoggedInUserDetailsApi,
    getUserDetailsById as getUserDetailsByIdApi,
    getUserDetailsByPrincipalName as getUserDetailsByPrincipalNameApi,
    getUserDetailsByDisplayName as getUserDetailsByDisplayNameApi
} from "../apis/api-list";

export const getLoggedInUserDetails = async (): Promise<IUser | undefined> => {
    try {
        const userDetails = await getLoggedInUserDetailsApi();
        return userDetails;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getUserDetailsById = async (id:string): Promise<IUser | undefined> => {
    try {
        const userDetails = await getUserDetailsByIdApi(id);
        return userDetails;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getUserDetailsByPrincipalName = async (upn:string): Promise<IUser | undefined> => {
    try {
        const userDetails = await getUserDetailsByPrincipalNameApi(upn);
        return userDetails;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getUserDetailsByDisplayName = async (displayName: string): Promise<IUser | undefined> => {
    try {
        const userDetails = await getUserDetailsByDisplayNameApi(displayName);
        return userDetails;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}