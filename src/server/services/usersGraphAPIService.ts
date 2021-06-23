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
            console.log(`getLoggedInUser::user is returned successfully`);

            return response.data
            ? Promise.resolve(response.data)
            : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getUserById`, error);
        }
    }
}