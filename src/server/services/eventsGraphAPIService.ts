import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { placesAppSetting } from '../../appSettings';
import { IAttendee } from '../../interfaces/IAttendee';
import { IEvent } from '../../interfaces/IEvent';
import { utilities } from '../../utilities';

export default class eventsGraphAPIService {
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

    public async getMyEventById(eventId: string): Promise<IEvent | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/me/events/${eventId}`, requestConfig);
            console.log(`getMyEventById::user is returned successfully`);

            return response
                && response.data ? Promise.resolve(response.data)
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getMyEventById`, error);
        }
    }

    public async getMyNextEventByLocationDisplayName(locationDisplayName: string): Promise<IEvent | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/me/events?$select=subject,bodyPreview,organizer,attendees,start,end,location&$filter=location/displayName eq '${locationDisplayName}' &$top=1&$count=true`, requestConfig);
            console.log(`getMyNextEventByLocationDisplayName::user is returned successfully`);

            return response.data 
            && response.data.value ? Promise.resolve(response.data.value)
            : undefined;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getMyNextEventByLocationDisplayName`, error);
        }
    }

    public async getMyNextEventByLocationEmailAddress(locationEmailAddress: string): Promise<IEvent | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            // filter by location/locationEmailAddress unavailable
            const response = await this.axiosInstance.get(`/me/events?$select=subject,bodyPreview,organizer,attendees,start,end,location&$top=100&$count=true`, requestConfig);
            console.log(`getMyNextEventByLocationEmailAddress::user is returned successfully`);

            let events: IEvent[]=[];
            if (response.data && response.data.value && response.data.value.length) {
                events = response.data.value.filter(x => x.location.locationEmailAddress === locationEmailAddress);
            }

            return events
            && events.length != 0 ? Promise.resolve(events[0])
            : undefined;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getMyNextEventByLocationEmailAddress`, error);
        }
    }
}