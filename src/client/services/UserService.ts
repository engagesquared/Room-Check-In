import { IUser } from '../../interfaces/IUser';
import {
    getLoggedInUser as getLoggedInUserApi,
    getUserById as getUserByIdApi,
    getUserByPrincipalName as getUserByPrincipalNameApi,
    getUserByDisplayName as getUserByDisplayNameApi,
    getAllUsers as getAllUsersApi,
    getAllUsersMembersOnly as getAllUsersMembersOnlyApi,
    getAllUsersGuestsOnly as getAllUsersGuestsOnlyApi
} from "../apis/api-list";

export const getLoggedInUser = async (): Promise<IUser | undefined> => {
    try {
        const userDetails = await getLoggedInUserApi();
        return userDetails;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getAllUsers = async (): Promise<IUser[] | undefined> => {
    try {
        const users = await getAllUsersApi();
        return users;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getAllUsersMembersOnly = async (): Promise<IUser[] | undefined> => {
    try {
        const users = await getAllUsersMembersOnlyApi();
        return users;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getAllUsersGuestsOnly = async (): Promise<IUser[] | undefined> => {
    try {
        const users = await getAllUsersGuestsOnlyApi();
        return users;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getUserById = async (id:string): Promise<IUser | undefined> => {
    try {
        const userDetails = await getUserByIdApi(id);
        return userDetails;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getUserByPrincipalName = async (upn:string): Promise<IUser | undefined> => {
    try {
        const userDetails = await getUserByPrincipalNameApi(upn);
        return userDetails;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getUserByDisplayName = async (displayName: string): Promise<IUser | undefined> => {
    try {
        const userDetails = await getUserByDisplayNameApi(displayName);
        return userDetails;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}