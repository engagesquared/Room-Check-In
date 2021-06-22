import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { placesAppSetting } from '../../appSettings';
import { IAttendee } from '../../interfaces/IAttendee';
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

    public async getMyEventAttendeesByLocationId(displayName: string): Promise<IAttendee[]> {
        return await [{
            type: "required",
            status: {
                response: "none",
                time: "0001-01-01T00:00:00Z"
            },
            emailAddress: {
                name: "Samantha Booth",
                address: "samanthab@a830edad905084922E17020313.onmicrosoft.com"
            }
        }];

        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    Prefer: "Pacific Standard Time"
                },
            };

            const response = await this.axiosInstance.get(`/me/events?$select=subject,bodyPreview,organizer,attendees,start,end,location&$count=true&$filter=location/uniqueId eq '${displayName}'&$top=1`, requestConfig);
            console.log(`getLoggedInUser::user is returned successfully`);

            return response
                && response.data.value ? Promise.resolve(response.data.value)
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getPlaceRoomsByName`, error);
        }
    }

    public async getMyEventAttendeesByLocationEmailAddress(locationEmailAddress: string): Promise<IAttendee[]> {
        return await [{
            type: "required",
            status: {
                response: "none",
                time: "0001-01-01T00:00:00Z"
            },
            emailAddress: {
                name: "Samantha Booth",
                address: "samanthab@a830edad905084922E17020313.onmicrosoft.com"
            }
        },
        {
            type: "required",
            status: {
                response: "none",
                time: "0001-01-01T00:00:00Z"
            },
            emailAddress: {
                name: "Ted CheckedIn",
                address: "ted@a830edad905084922E17020313.onmicrosoft.com"
            }
        }];

        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    Prefer: "Pacific Standard Time"
                },
            };

            const response = await this.axiosInstance.get(`/me/events?$select=subject,bodyPreview,organizer,attendees,start,end,location&$count=true&$filter=locationEmailAddress eq ${locationEmailAddress} and (formatDateTime(start,'dd/MM/yyyyT00:00:00Z') ge formatDateTime(utcNow(),'dd/MM/yyyyT00:00:00Z') and formatDateTime(end,'dd/MM/yyyyT00:00:00Z') le formatDateTime(utcNow(),'dd/MM/yyyyT00:00:00Z'))&$top=1`, requestConfig);
            console.log(`getLoggedInUser::user is returned successfully`);

            return response
                && response.data.value ? Promise.resolve(response.data.value)
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getPlaceRoomsByName`, error);
        }
    }
}