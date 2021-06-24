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
import { TableClient, AzureNamedKeyCredential, ListTableEntitiesOptions } from "@azure/data-tables";
import lodashArray = require('lodash/array');

class dataTableStorageService {
    private tableUrl: string;
    private credential: AzureNamedKeyCredential;

    constructor() {
        try {
            this.tableUrl = `https://${azureDataTableAppSetting.accountName}.table.core.windows.net`;
            this.credential = new AzureNamedKeyCredential(azureDataTableAppSetting.accountName, azureDataTableAppSetting.accountKey);
        }
        catch (error) {
            throw error;
        }
    }

    public async addCheckIn(checkIn: ICheckIn): Promise<string> {
        try {
            const checkInAdded: IDBCheckIn[] = [];
            const checkInAlreadyExists: any[] = [];
            const checkInClient = new TableClient(this.tableUrl, constants.CHECKIN_TABLE_NAME, this.credential);

            const usersAdded = await this.addUsers(checkIn.users);
            const roomAdded = await this.addRoom(checkIn.room);
            const eventAdded = await this.addEvent(checkIn.event);

            for (const user of usersAdded) {
                try {
                    const listEntititesOptions: ListTableEntitiesOptions = {
                        queryOptions: {
                            filter: `roomId eq '${roomAdded.id}' and eventId eq'${eventAdded.id}' and userId eq '${user.rowKey}'`
                        }
                    }
                    const checkInFound = checkInClient.listEntities(listEntititesOptions);
                    let skipCheckIn = false;
                    for await (const entity of checkInFound) {
                        skipCheckIn = true;
                    }

                    if (skipCheckIn) {
                        checkInAlreadyExists.push(checkInFound);
                    }
                    else {
                        const dbEntity: IDBCheckIn = {
                            partitionKey: checkIn.room.displayName,
                            rowKey: uuidv4(),
                            eventId: eventAdded.id,
                            roomId: roomAdded.id,
                            userId: user.rowKey
                        };
                        await checkInClient.createEntity(dbEntity);
                        checkInAdded.push(dbEntity);
                    }
                }
                catch (error) {
                    console.error(error);
                }

            };

            return `${checkInAdded.length}/${checkIn.users.length} added and ${checkInAlreadyExists.length}/${checkIn.users.length} already existed`;
        }
        catch (error) {
            throw error;
        }
    }

    private async addUsers(users: IUserAdd[]): Promise<IDBUser[]> {
        try {
            const usersAdded: IDBUser[] = [];
            await Promise.all(users.map((async user => {
                const listEntititesOptions: ListTableEntitiesOptions = {
                    queryOptions: {
                        filter: `displayName eq '${user.displayName}' or mail eq'${user?.mail}'`
                    }
                }
                const userClientCheck = new TableClient(this.tableUrl, constants.USER_TABLE_NAME, this.credential);
                const userFound = userClientCheck.listEntities(listEntititesOptions);

                let skipUser = false;
                for await (const entity of userFound) {
                    let user: IDBUser = {
                        partitionKey: entity.partitionKey as string,
                        rowKey: entity.rowKey as string,
                        displayName: entity["displayName"] as string,
                        principalName: entity["principalName"] as string ?? "",
                        mail: entity["mail"] as string ?? "",
                        phone: entity["phone"] as string ?? "",
                        employeeId: entity["employeeId"] as string ?? "",
                        id: entity["id"] as string ?? "",
                    }
                    usersAdded.push(user);
                    skipUser = true;
                }

                if (!skipUser) {
                    //if (userFound && userFound.byPage.length == 0) {
                    const dbEntity: IDBUserAdd = {
                        partitionKey: user.displayName,
                        rowKey: uuidv4(),
                        displayName: user.displayName,
                        principalName: user.principalName,
                        mail: user.mail ?? "",
                        phone: user.phone ?? "",
                        employeeId: user.employeeId ?? "",
                        id: user.id ?? ""
                    };

                    const client = new TableClient(this.tableUrl, constants.USER_TABLE_NAME, this.credential);
                    await client.createEntity(dbEntity);
                    usersAdded.push(dbEntity);
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
            const listEntititesOptions: ListTableEntitiesOptions = {
                queryOptions: {
                    filter: `id eq '${room.id}'`
                }
            }
            const roomClientCheck = new TableClient(this.tableUrl, constants.ROOM_TABLE_NAME, this.credential);
            const roomFound = roomClientCheck.listEntities(listEntititesOptions);
            for await (const entity of roomFound) {
                return {
                    partitionKey: entity.partitionKey as string,
                    rowKey: entity.rowKey as string,
                    displayName: entity["displayName"] as string,
                    emailAddress: entity["emailAddress"] as string ?? "",
                    phone: entity["phone"] as string ?? "",
                    capacity: entity["capacity"] as number ?? "",
                    building: entity["building"] as string ?? "",
                    id: entity["id"] as string ?? "",
                } as IDBRoomAdd;
            }

            const client = new TableClient(this.tableUrl, constants.ROOM_TABLE_NAME, this.credential);
            const dbEntity: IDBRoomAdd = {
                partitionKey: room.displayName,
                rowKey: uuidv4(),
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
            const listEntititesOptions: ListTableEntitiesOptions = {
                queryOptions: {
                    filter: `id eq '${event.id}'`
                }
            }
            const eventClientCheck = new TableClient(this.tableUrl, constants.EVENT_TABLE_NAME, this.credential);
            const eventFound = eventClientCheck.listEntities(listEntititesOptions);
            if (eventFound && eventFound.byPage.length) {
                for await (const entity of eventFound) {
                    return {
                        partitionKey: entity.partitionKey as string,
                        rowKey: entity.rowKey as string,
                        subject: entity["subject"] as string,
                        start: entity["start"] as string ?? "",
                        end: entity["end"] as string ?? "",
                        locationDisplayName: entity["locationDisplayName"] as string ?? "",
                        locationEmail: entity["locationEmail"] as string ?? "",
                        id: entity["id"] as string ?? "",
                    } as IDBEvent;
                }
            }

            const client = new TableClient(this.tableUrl, constants.EVENT_TABLE_NAME, this.credential);
            const dbEntity: IDBEventAdd = {
                partitionKey: event.subject,
                rowKey: uuidv4(),
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

    public async getCheckedInUsers(roomId: string, eventId: string): Promise<IDBUser[]> {
        try {
            return await [{
                partitionKey: "user-displayName-1",
                rowKey: "a8dad104-3e0f-4020-94af-f49c5bb61647",
                displayName: "user-displayName-1",
                principalName: "user-upn-1",
                mail: "user-mail-1",
                phone: "user-phone-1",
                employeeId: "user-empId-1",
                id: ""
            },
            {
                partitionKey: "user-displayName-2",
                rowKey: "b14c1b8a-7220-4473-8f7b-64887c85edd6",
                displayName: "user-displayName-2",
                principalName: "user-upn-2",
                mail: "user-mail-2",
                phone: "user-phone-2",
                employeeId: "user-empId-2",
                id: ""
            }];

            const checkInlistEntititesOptions: ListTableEntitiesOptions = {
                queryOptions: {
                    filter: `roomId eq '${roomId}' and eventId eq '${eventId}'`
                }
            }
            const checkInClient = new TableClient(this.tableUrl, constants.CHECKIN_TABLE_NAME, this.credential);
            const roomCheckIns = await checkInClient.listEntities(checkInlistEntititesOptions);
            const userIds: string[] = [];
            for await (const entity of roomCheckIns) {
                userIds.push(`rowKey eq '${entity["userId"]}'` as string);
            }
            if (userIds.length == 0) return [];

            const userIdsToFind: string = lodashArray.join(userIds, ' or ');
            const userListEntititesOptions: ListTableEntitiesOptions = {
                queryOptions: {
                    filter: userIdsToFind
                }
            }
            const userClient = new TableClient(this.tableUrl, constants.USER_TABLE_NAME, this.credential);
            const users = await userClient.listEntities(userListEntititesOptions);
            const roomUsers: IDBUser[] = [];
            for await (const entity of users) {
                let user: IDBUser = {
                    partitionKey: entity.partitionKey as string,
                    rowKey: entity.rowKey as string,
                    displayName: entity["displayName"] as string,
                    principalName: entity["principalName"] as string ?? "",
                    mail: entity["mail"] as string ?? "",
                    phone: entity["phone"] as string ?? "",
                    employeeId: entity["employeeId"] as string ?? "",
                    id: entity["id"] as string ?? "",
                }
                roomUsers.push(user);
            }

            return roomUsers;
        }
        catch (error) {
            throw error;
        }
    }
}
export default new dataTableStorageService();