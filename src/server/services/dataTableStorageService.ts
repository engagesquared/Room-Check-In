import { azureDataTableAppSetting } from "../../appSettings";
import { constants } from "../../constants";
import { IDBCheckIn } from "../../interfaces/IDBCheckIn";
import { ICheckIn } from "../../interfaces/ICheckIn";
import { IDBRoom } from "../../interfaces/IDBRoom";
import { v4 as uuidv4 } from 'uuid';
import { IDBUserAdd } from "../../interfaces/IDBUserAdd";
import { IDBRoomAdd } from "../../interfaces/IDBRoomAdd";
import { IRoomAdd } from "../../interfaces/IRoomAdd";
import { IDBEvent } from "../../interfaces/IDBEvent";
import { IDBUser } from "../../interfaces/IDBUser";
import { IDBEventAdd } from "../../interfaces/IDBEventAdd";
import { IEventAdd } from "../../interfaces/IEventAdd";
import { IUserAdd } from "../../interfaces/IUserAdd";
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

    public async checkIn(checkIns: ICheckIn[]): Promise<IDBCheckIn[]> {
        try {
            const checkInsAdded: IDBCheckIn[] = [];
            const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.CHECKIN_TABLE_NAME, this.credential);
            checkIns.forEach(async checkIn => {
                const usersAdded = await this.addUsers(checkIn.users);
                const roomAdded = await this.addRoom(checkIn.room);
                const eventAdded = await this.addEvent(checkIn.event);

                await Promise.all(usersAdded.map((async userAdded => {
                    const dbEntity: IDBCheckIn = {
                        PartitionKey: checkIn.room.displayName,
                        RowKey: `${roomAdded.id}-${eventAdded.id}`,
                        eventId: eventAdded.id,
                        roomId: roomAdded.id,
                        userId: userAdded.RowKey
                    };
                    await client.createEntity(dbEntity);
                    checkInsAdded.push(dbEntity);
                })));
            });
            return checkInsAdded;
        }
        catch (error) {
            throw error;
        }
    }

    private async addUsers(users: IUserAdd[]): Promise<IDBUser[]> {
        try {
            const usersAdded: IDBUser[] = [];
            await Promise.all(users.map((async user => {
                const userClientCheck = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net/${constants.USER_TABLE_NAME}()?$filter=displayName%20eq%20'${user.displayName}'%20or%mail%20eq%20'${user?.mail}'&$top=1`, constants.USER_TABLE_NAME, this.credential);
                const userFound: IDBUser[] = await userClientCheck.listEntities();
                if (userFound.length == 0) {
                    const dbEntity: IDBUserAdd = {
                        PartitionKey: user.displayName,
                        RowKey: uuidv4(),
                        displayName: user.displayName,
                        principalName: user.principalName,
                        mail: user.mail ?? "",
                        phone: user.phone ?? "",
                        employeeId: user.employeeId ?? "",
                        id: user.id ?? ""
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

    private async addRoom(room: IRoomAdd): Promise<IDBRoom> {
        try {
            const roomClientCheck = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net/${constants.ROOM_TABLE_NAME}()?$filter=Id%20eq%20'${room.id}'&$top=1`, constants.ROOM_TABLE_NAME, this.credential);
            const roomFound: IDBRoom[] = await roomClientCheck.listEntities();
            if (roomFound.length != 0) return roomFound[0];

            const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.ROOM_TABLE_NAME, this.credential);
            const dbEntity: IDBRoomAdd = {
                PartitionKey: room.displayName,
                RowKey: uuidv4(),
                displayName: room.displayName,
                building: room.building,
                capacity: room.capacity,
                emailAddress: room.emailAddress,
                id: room.id
            };
            await client.createEntity(dbEntity);
            return dbEntity;
        }
        catch (error) {
            throw error;
        }
    }

    private async addEvent(event: IEventAdd): Promise<IDBEvent> {
        try {
            const eventClientCheck = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net/${constants.EVENT_TABLE_NAME}()?$filter=Id%20eq%20'${event.id}'&$top=1`, constants.EVENT_TABLE_NAME, this.credential);
            const eventFound: IDBEvent[] = await eventClientCheck.listEntities();
            if (eventFound.length != 0) return eventFound[0];

            const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.EVENT_TABLE_NAME, this.credential);
            const dbEntity: IDBEventAdd = {
                PartitionKey: event.subject,
                RowKey: uuidv4(),
                subject: event.subject,
                start: event.start,
                end: event.end,
                locationDisplayName: event.locationDisplayName,
                locationEmail: event.locationEmail,
                id: event.id
            };
            await client.createEntity(dbEntity);
            return dbEntity;
        }
        catch (error) {
            throw error;
        }
    }

    public async getAllCheckedInUsersInRoomAndEvent(roomId: string, eventId: string): Promise<IDBUser[]> {
        return await [{
            PartitionKey: "",
            RowKey: "",
            displayName: "",
            mail: "",
            principalName: "",
            phone: "",
            employeeId: "",
            id: ""
        },
        {
            PartitionKey: "",
            RowKey: "",
            displayName: "",
            phone: "",
            mail: ""
        },
        {
            PartitionKey: "",
            RowKey: "",
            displayName: "",
            phone: "",
            mail: ""
        }];

        const checkInClient = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net/${constants.CHECKIN_TABLE_NAME}()?$filter=RowKey%20eq%20$'${roomId}-${eventId}')`, constants.CHECKIN_TABLE_NAME, this.credential);
        const roomCheckIns: IDBCheckIn[] = await checkInClient.listEntities();
        const userIds: string[] = roomCheckIns.map((chechIn) => { return `'${chechIn.userId}'` });
        const userIdsToFind: string = lodashArray.join(userIds, ',');

        const userClient = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net/${constants.USER_TABLE_NAME}()?$filter=RowKey%20in%20(${userIdsToFind})`, constants.USER_TABLE_NAME, this.credential);
        const RoomUsers: IDBUser[] = await userClient.listEntities();

        return RoomUsers;
    }
}
export default new dataTableStorageService();