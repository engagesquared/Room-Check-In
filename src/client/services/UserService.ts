import { constants } from "../../constants";
import axios from "axios";
import { IUser } from '../../interfaces/IUser';
import { getClientSideToken } from "./AuthService";

export const getLoggedInUserDetails = async (): Promise<IUser | undefined> => {
    try {
        const clientSideToken = await getClientSideToken();
        const res: any = await axios.get(`/api/loggedInUserDetails`
            , { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getUserDetailsById = async (id:string): Promise<IUser | undefined> => {
    try {
        const clientSideToken = await getClientSideToken();
        const res: any = await axios.get(`/api/userDetailsById?id=${id}`
            , { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getUserDetailsByPrincipalName = async (upn:string): Promise<IUser | undefined> => {
    try {
        const clientSideToken = await getClientSideToken();
        const res: any = await axios.get(`/api/userDetailsByPrincipalName?upn=${upn}`
            , { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getUserDetailsByDisplayName = async (displayName: string): Promise<IUser | undefined> => {
    try {
        const clientSideToken = await getClientSideToken();
        const res: any = await axios.get(`/api/userDetailsByDisplayName?displayName=${displayName}`
            , { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}