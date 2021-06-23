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

    public async getMyEventDetailsId(eventId: string): Promise<IEvent | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const response = await this.axiosInstance.get(`/me/events/${eventId}`, requestConfig);
            console.log(`getMyEventAttendeesByLocationId::user is returned successfully`);

            return response
                && response.data ? Promise.resolve(response.data)
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getPlaceRoomsByName`, error);
        }
    }

    public async getMyEventByLocationId(locationId: string): Promise<IEvent[] | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            // filter by location/uniqueId unavailable
            const response = await this.axiosInstance.get(`/me/events?$select=subject,bodyPreview,organizer,attendees,start,end,location&$top=100&$count=true`, requestConfig);
            console.log(`getMyEventByLocationId::user is returned successfully`);
            
            let events = [];
            if (response.data && response.data.value && response.data.value.length) {
                events = response.data.value.filter(x => x.location.uniqueId === locationId);
            }
            return events;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getMyEventByLocationId`, error);
        }
    }

    public async getMyEventIAttendeesByLocationEmailAddress(locationEmailAddress: string): Promise<IAttendee[] | undefined> {
        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            };

            // filter by location/locationEmailAddress unavailable
            const response = await this.axiosInstance.get(`/me/events?$select=subject,bodyPreview,organizer,attendees,start,end,location&$top=100&$count=true`, requestConfig);
            console.log(`getMyEventIAttendeesByLocationEmailAddress::user is returned successfully`);

            var attendees = [];
            if (response.data && response.data.value && response.data.value.length) {
                const events = response.data.value.filter(x => x.location.locationEmailAddress === locationEmailAddress);
                if (events.length) {
                    attendees = events[0].attendees;
                }
            }

            return attendees;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getMyEventIAttendeesByLocationEmailAddress`, error);
        }
    }
}