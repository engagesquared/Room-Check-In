import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { usersAppSetting } from '../../appSettings';
import { IUser } from '../../interfaces/response/IUser';
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

    public async getLoggedInUserDetails(): Promise<IUser> {
        return {
            displayName: "Adele Vance",
            givenName: "Adele",
            jobTitle: "Retail Manager",
            mail: "AdeleV@contoso.onmicrosoft.com",
            mobilePhone: "+1 425 555 0109",
            officeLocation: "18/2111",
            surname: "Vance",
            userPrincipalName: "AdeleV@contoso.onmicrosoft.com",
            id: "87d349ed-44d7-43e1-9a83-5f2406dee5bd"
        };
        
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/users/me`, requestConfig);
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