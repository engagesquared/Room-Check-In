import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { placesAppSetting } from '../../appSettings';
import { IAttendee } from '../../interfaces/response/IAttendee';
import { IEvent } from '../../interfaces/response/IEvent';
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

    public async getMyEventDetailsId(eventId: string): Promise<IEvent> {
        return await {
            subject: "subject",
            attendees: [{
                type: "required",
                status: {
                    response: "none",
                    time: "0001-01-01T00:00:00Z"
                },
                emailAddress: {
                    name: "Samantha Booth",
                    address: "samanthab@a830edad905084922E17020313.onmicrosoft.com"
                }
            }],
            end: {
                "dateTime": "2017-08-29T04:00:00.0000000",
                "timeZone": "Australia/Sydney"
            },
            start: {
                "dateTime": "2017-08-29T06:00:00.0000000",
                "timeZone": "Australia/Sydney"
            },
            bodyPreview: "bodyPreview",
            location: {
                address: {
                    street: "string",
                    city: "string",
                    state: "string",
                    postalCode: "string",
                    countryOrRegion: "string"
                },
                coordinates: {
                    latitude: 1,
                    longitude: 2
                },
                displayName: "location",
                locationEmailAddress: "location-email",
                locationUri: "location-uri",
                locationType: "type",
                uniqueId: "uid",
                uniqueIdType: "uidtype"
            }
        };

        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    Prefer: "Pacific Standard Time"
                },
            };

            const response = await this.axiosInstance.get(`/me/events/${eventId}`, requestConfig);
            console.log(`getMyEventAttendeesByLocationId::user is returned successfully`);

            return response
                && response.data.value ? Promise.resolve(response.data.value)
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getPlaceRoomsByName`, error);
        }
    }

    public async getMyEventByLocationId(locationId: string): Promise<IEvent[]> {
        return await [{
            subject: "subject",
            attendees: [{
                type: "required",
                status: {
                    response: "none",
                    time: "0001-01-01T00:00:00Z"
                },
                emailAddress: {
                    name: "Samantha Booth",
                    address: "samanthab@a830edad905084922E17020313.onmicrosoft.com"
                }
            }],
            end: {
                "dateTime": "2017-08-29T04:00:00.0000000",
                "timeZone": "Australia/Sydney"
            },
            start: {
                "dateTime": "2017-08-29T06:00:00.0000000",
                "timeZone": "Australia/Sydney"
            },
            bodyPreview: "bodyPreview",
            location: {
                address: {
                    street: "string",
                    city: "string",
                    state: "string",
                    postalCode: "string",
                    countryOrRegion: "string"
                },
                coordinates: {
                    latitude: 1,
                    longitude: 2
                },
                displayName: "location",
                locationEmailAddress: "location-email",
                locationUri: "location-uri",
                locationType: "type",
                uniqueId: "uid",
                uniqueIdType: "uidtype"
            }
        }];

        try {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    Prefer: "Pacific Standard Time"
                },
            };

            const response = await this.axiosInstance.get(`/me/events?$select=subject,bodyPreview,organizer,attendees,start,end,location&$count=true&$filter=location/uniqueId eq '${locationId}'&$top=1`, requestConfig);
            console.log(`getMyEventByLocationId::user is returned successfully`);

            return response
                && response.data.value ? Promise.resolve(response.data.value)
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getMyEventByLocationId`, error);
        }
    }

    public async getMyEventByLocationEmailAddress(locationEmailAddress: string): Promise<IAttendee[]> {
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
            console.log(`getMyEventAttendeesByLocationEmailAddress::user is returned successfully`);

            return response
                && response.data.value ? Promise.resolve(response.data.value)
                : null;
        }
        catch (error) {
            utilities.throwGraphAPIError(`getMyEventByLocationEmailAddress`, error);
        }
    }
}