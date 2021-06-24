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

    public async getLoggedInUserDetails(): Promise<IUser | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/me`, requestConfig);
            console.log(`getLoggedInUserDetails::user is returned successfully`);

            return response.data
            ? Promise.resolve(response.data)
            : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getLoggedInUserDetails`, error);
        }
    }

    public async getUserDetailsById(userId:string): Promise<IUser | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/users/${userId}`, requestConfig);
            console.log(`getUserDetailsById::user is returned successfully`);

            return response.data
            ? Promise.resolve(response.data)
            : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getUserDetailsById`, error);
        }
    }

    public async getUserDetailsByPrincipalName(upn:string): Promise<IUser | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/users/?$count=true&$filter=userPrincipalName eq '${upn}'&$top=1`, requestConfig);
            console.log(`getUserDetailsByPrincipalName::user is returned successfully`);

            return response
                && response.data.value
                ? Promise.resolve(response.data.value[0])
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getUserDetailsByPrincipalName`, error);
        }
    }

    public async getUserDetailsByDisplayName(email:string): Promise<IUser | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/users/?$count=true&$filter=displayName eq '${email}'&$top=1`, requestConfig);
            console.log(`getUserDetailsByDisplayName::user is returned successfully`);

            return response
                && response.data.value
                ? Promise.resolve(response.data.value[0])
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getUserDetailsByDisplayName`, error);
        }
    }
}