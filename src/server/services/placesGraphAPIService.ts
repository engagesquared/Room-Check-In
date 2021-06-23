import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { placesAppSetting } from '../../appSettings';
import { IRoom } from '../../interfaces/IRoom';
import { utilities } from '../../utilities';

export default class placesGraphAPIService {
    axiosInstance: AxiosInstance;
    token: string;

    constructor(token: string) {
        this.token = token;
        this.axiosInstance = axios.create({
            baseURL: placesAppSetting.apiUrl,
            headers: [{
                'Content-Type': 'application/json'
            }]
        });
    }

    public async getPlaceById(id: string): Promise<IRoom | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/places/${id}`, requestConfig);
            console.log(`getLoggedInUser::user is returned successfully`);

            return response.data
                ? Promise.resolve(response.data)
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getPlaceRoomsByName`, error);
        }
    }

    public async getRoomByDisplayName(displayName: string): Promise<IRoom | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/places/microsoft.graph.room?$count=true&$filter=displayName eq '${displayName}'&$top=1`, requestConfig);
            console.log(`getLoggedInUser::user is returned successfully`);

            return response
                && response.data.value
                && response.data.value.length != 0
                && response.data.value[0] ? Promise.resolve(response.data.value[0])
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getPlaceRoomsByName`, error);
        }
    }

    public async getRoomLocationByEmailAddress(emailAddress: string): Promise<string | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/users/${emailAddress}`, requestConfig);
            console.log(`getLoggedInUser::user is returned successfully`);

            return response && response.data && response.data.officeLocation ? response.data.officeLocation : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getPlaceRoomsByName`, error);
        }
    }
}