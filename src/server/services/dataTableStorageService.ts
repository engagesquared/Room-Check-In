import { azureDataTableAppSetting } from "../../appSettings";
import { constants } from "../../constants";
import { IDBCheckIn } from "../../interfaces/IDBCheckIn";
import { ICheckIn } from "../../interfaces/ICheckIn";
import { v4 as uuidv4 } from 'uuid';
import { IUser } from "../../interfaces/IUser";
import { IRoom } from "../../interfaces/IRoom";
import { IEvent } from "../../interfaces/IEvent";
import { IDBEvent } from "../../interfaces/IDBEvent";
import { IAttendee } from "../../interfaces/IAttendee";
import { IDBUser } from "../../interfaces/IDBUser";
import usersGraphAPIService from "./usersGraphAPIService";
const lodashArray = require('lodash/array');

const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

class dataTableStorageService {
    private credential: any;

    constructor() {
        try {
            this.credential = new AzureNamedKeyCredential(azureDataTableAppSetting.accountName, azureDataTableAppSetting.accountKey);
        }
        catch (error) {
            throw error;
        }
    }

    public async checkIn(checkIns: ICheckIn[]) {
        try {
            const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.CHECKIN_TABLE_NAME, this.credential);
            checkIns.forEach(async checkIn => {
                const usersAdded = await this.addUsers(checkIn.users);
                const roomId = await this.addRoom(checkIn.room);
                const eventId = await this.addEvent(checkIn.event);

                await Promise.all(usersAdded.map((async userAdded => {
                    const dbEntity: IDBCheckIn = {
                        PartitionKey: checkIn.room.displayName,
                        RowKey: uuidv4(),
                        EventId: eventId,
                        RoomId: roomId,
                        UserId: userAdded.Id,
                        UserDisplayName: userAdded.DisplayName
                    };
                    await client.createEntity(dbEntity);
                })));

            });
        }
        catch (error) {
            throw error;
        }
    }

    private async addUsers(users: IUser[]): Promise<IDBUser[]> {
        try {
            const usersAdded: IDBUser[] = [];
            await Promise.all(users.map((async user => {
                const userClientCheck = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net/${constants.USER_TABLE_NAME}()?$filter=DisplayName%20eq%20'${user.displayName}'%20or%Email%20eq%20'${user?.mail}'&$top=1`, constants.USER_TABLE_NAME, this.credential);
                const userFound: IDBUser[] = await userClientCheck.listEntities();
                if (userFound.length == 0) {
                    const id = uuidv4();
                    const dbEntity: IDBUser = {
                        PartitionKey: user.displayName,
                        RowKey: id,
                        DisplayName: user.displayName,
                        PrincipalName: user.userPrincipalName,
                        Email: user.mail ?? "",
                        Phone: user.mobilePhone ?? "",
                        Id: id
                    };

                    const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.USER_TABLE_NAME, this.credential);
                    await client.createEntity(dbEntity);
                    usersAdded.push(dbEntity);
                }
                else {
                    usersAdded.push(userFound[0]);
                }
            })));
            return usersAdded;
        }
        catch (error) {
            throw error;
        }
    }

    private async addRoom(room: IRoom): Promise<string> {
        try {
            const roomClientCheck = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net/${constants.ROOM_TABLE_NAME}()?$filter=Id%20eq%20'${room.id}'&$top=1`, constants.ROOM_TABLE_NAME, this.credential);
            const roomFound: IDBUser[] = await roomClientCheck.listEntities();
            if (roomFound.length != 0) return roomFound[0].Id;

            const id = uuidv4();
            const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.ROOM_TABLE_NAME, this.credential);
            const dbEntity = {
                PartitionKey: room.displayName,
                RowKey: id,
                DisplayName: room.displayName,
                Building: room.building,
                Capacity: room.capacity,
                EmailAddress: room.emailAddress,
                Id: id
            };
            await client.createEntity(dbEntity);
            return id;
        }
        catch (error) {
            throw error;
        }
    }

    private async addEvent(event: IEvent): Promise<string> {
        try {
            const eventClientCheck = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net/${constants.EVENT_TABLE_NAME}()?$filter=Id%20eq%20'${event.id}'&$top=1`, constants.EVENT_TABLE_NAME, this.credential);
            const eventFound: IDBUser[] = await eventClientCheck.listEntities();
            if (eventFound.length != 0) return eventFound[0].Id;

            const id = uuidv4();
            const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.EVENT_TABLE_NAME, this.credential);
            const dbEntity = {
                PartitionKey: event.subject,
                RowKey: id,
                Subject: event.subject,
                StartTime: event.start,
                EndTime: event.end,
                LocationDisplayName: event.location.displayName,
                LocationEmail: event.location.locationEmailAddress,
                Id: id
            };
            await client.createEntity(dbEntity);
            return id;
        }
        catch (error) {
            throw error;
        }
    }

    public async getAllCheckedInUsersInRoomAndEvent(roomId: string,eventId: string): Promise<IDBUser[]> {
        return await [{
            PartitionKey: "",
            RowKey: "",
            DisplayName: "",
            Email: "",
            PrincipalName: "",
            Phone: "",
            Id: ""
        },
        {
            PartitionKey: "",
            RowKey: "",
            DisplayName: "",
            Phone: "",
            Email: "",
            Id: ""
        },
        {
            PartitionKey: "",
            RowKey: "",
            DisplayName: "",
            Phone: "",
            Email: "",
            Id: ""
        }];

        const checkInClient = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net/${constants.CHECKIN_TABLE_NAME}()?$filter=RoomId%20eq%20$'${roomId}'%20and%20'EventId%20eq%20'${eventId}')`, constants.CHECKIN_TABLE_NAME, this.credential);
        const roomCheckIns: IDBCheckIn[] = await checkInClient.listEntities();
        const userIds: string[] = roomCheckIns.map((chechIn) => { return `'${chechIn.UserId}'` });
        const userIdsToFind: string = lodashArray.join(userIds, ',');

        const userClient = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net/${constants.USER_TABLE_NAME}()?$filter=Id%20in%20(${userIdsToFind})`, constants.USER_TABLE_NAME, this.credential);
        const RoomUsers: IDBUser[] = await userClient.listEntities();

        return RoomUsers;
    }
}
export default new dataTableStorageService();