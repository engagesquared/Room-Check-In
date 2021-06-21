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

    public async getPlaceRoomById(id: string): Promise<IRoom> {
        return {
            id: id,
            emailAddress: "room@email.com",
            displayName: "roome#1",
            address: {
                "street": "4567 Main Street",
                "city": "Buffalo",
                "state": "NY",
                "postalCode": "98052",
                "countryOrRegion": "USA"
            },
            phone: "1800",
            nickname: "room#1",
            label: "room#1",
            capacity: 10,
            building: "bulding#1",
            floorNumber: 2,
            isManaged: true,
            isWheelChairAccessible: true,
            bookingType: "string",
            geoCoordinates: {
                "latitude": 47.640568390488626,
                "longitude": -122.1293731033803
            }
        };

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

    public async getPlaceRoomByDisplayName(displayName: string): Promise<IRoom> {
        return {
            id: "3162F1E1-C4C0-604B-51D8-91DA78989EB1",
            emailAddress: "room@email.com",
            displayName: "roome#1",
            address: {
                "street": "4567 Main Street",
                "city": "Buffalo",
                "state": "NY",
                "postalCode": "98052",
                "countryOrRegion": "USA"
            },
            phone: "1800",
            nickname: "room#1",
            label: "room#1",
            capacity: 10,
            building: "bulding#1",
            floorNumber: 2,
            isManaged: true,
            isWheelChairAccessible: true,
            bookingType: "string",
            geoCoordinates: {
                "latitude": 47.640568390488626,
                "longitude": -122.1293731033803
            }
        };

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
}