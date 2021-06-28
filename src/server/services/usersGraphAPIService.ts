import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { usersAppSetting } from '../../appSettings';
import { IUser } from '../../interfaces/IUser';
import { utilities } from '../../utilities';

export default  class usersGraphAPIService {
    axiosInstance: AxiosInstance;
    token: string;

    constructor(token:string) {
        this.token = token;
        this.axiosInstance = axios.create({
            baseURL: usersAppSetting.apiUrl,
            headers: [{
                'Content-Type': 'application/json'
            }]
        });
    }

    public async getLoggedInUser(): Promise<IUser | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/me`, requestConfig);
            console.log(`getLoggedInUser::user is returned successfully`);

            return response.data
            ? Promise.resolve(response.data)
            : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getLoggedInUser`, error);
        }
    }

    public async getAllUsers(): Promise<IUser[]| undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/users`, requestConfig);
            console.log(`getUsers::user is returned successfully`);

            return response.data
            ? Promise.resolve(response.data)
            : Promise.resolve([]);
        }
        catch (error) {
            utilities.throwGraphAPIError(`getUsers`, error);
        }
    }

    public async getAllUsersByUserType(userType:string): Promise<IUser[]| undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/users?$filter=userType eq '${userType}'`, requestConfig);
            console.log(`getUsers::user is returned successfully`);

            return response.data
            ? Promise.resolve(response.data)
            : Promise.resolve([]);
        }
        catch (error) {
            utilities.throwGraphAPIError(`getUsers`, error);
        }
    }

    public async getUserById(userId:string): Promise<IUser | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/users/${userId}`, requestConfig);
            console.log(`getUserById::user is returned successfully`);

            return response.data
            ? Promise.resolve(response.data)
            : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getUserById`, error);
        }
    }

    public async getUserByPrincipalName(upn:string): Promise<IUser | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/users/?$count=true&$filter=userPrincipalName eq '${upn}'&$top=1`, requestConfig);
            console.log(`getUserByPrincipalName::user is returned successfully`);

            return response
                && response.data.value
                ? Promise.resolve(response.data.value[0])
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getUserByPrincipalName`, error);
        }
    }

    public async getUserByDisplayName(displayName:string): Promise<IUser | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/users/?$count=true&$filter=displayName eq '${displayName}'&$top=1`, requestConfig);
            console.log(`getUserByDisplayName::user is returned successfully`);

            return response
                && response.data.value
                ? Promise.resolve(response.data.value[0])
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getUserByDisplayName`, error);
        }
    }
}