import { azureDataTableAppSetting } from "../../appSettings";
import { constants } from "../../constants";
import { IDBCheckIn } from "../../interfaces/IDBCheckIn";
import { ICheckIn } from "../../interfaces/ICheckIn";
import { IDBRoom } from "../../interfaces/IDBRoom";
import { v4 as uuidv4 } from 'uuid';
import { IDBUserAdd, instanceOfIDBUserAdd } from "../../interfaces/IDBUserAdd";
import { IDBRoomAdd, instanceOfIDBRoomAdd } from "../../interfaces/IDBRoomAdd";
import { IRoomAdd } from "../../interfaces/IRoomAdd";
import { IDBEvent } from "../../interfaces/IDBEvent";
import { IDBUser } from "../../interfaces/IDBUser";
import { IDBEventAdd, instanceOfIDBEventAdd } from "../../interfaces/IDBEventAdd";
import { IEventAdd } from "../../interfaces/IEventAdd";
import { IUserAdd } from "../../interfaces/IUserAdd";
import { TableClient, AzureNamedKeyCredential, ListTableEntitiesOptions, TableEntityResult } from "@azure/data-tables";
import lodashArray = require('lodash/array');
import * as moment from 'moment';

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
                            filter: `roomId eq '${roomAdded.id}' and eventId eq'${eventAdded.rowKey}' and userId eq '${user.rowKey}'`
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
                            eventId: eventAdded.rowKey,
                            roomId: roomAdded.id,
                            userId: user.rowKey
                        };
                        await checkInClient.createEntity(dbEntity);
                        checkInAdded.push(dbEntity);
                    }
                }
                catch (error) {
                    console.error(`user '${user.mail}' failed to be added to room '${roomAdded.displayName}' for event '${eventAdded.subject}'::${error}`);
                }

            };

            return `${checkInAdded.length}/${checkIn.users.length} added and ${checkInAlreadyExists.length}/${checkIn.users.length} already existed`;
        }
        catch (error) {
            console.error(error.stack);
            return (error);
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
                    let userEntity = this.getDBUserEntity(entity);
                    usersAdded.push(userEntity);
                    skipUser = true;
                }

                if (!skipUser) {
                    //if (userFound && userFound.byPage.length == 0) {
                    const dbEntity: IDBUserAdd = {
                        partitionKey: user.displayName,
                        rowKey: user.mail,
                        displayName: user.displayName,
                        principalName: user.principalName ?? "",
                        mail: user.mail,
                        phone: user.phone ?? "",
                        employeeId: user.employeeId ?? "",
                        id: user.id ?? "",
                        external: user.external ?? false
                    };

                    const client = new TableClient(this.tableUrl, constants.USER_TABLE_NAME, this.credential);
                    await client.createEntity(dbEntity);
                    let userAdded = this.getDBUserEntity(dbEntity);
                    usersAdded.push(userAdded);
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
                    filter: `RowKey eq '${room.id}'`
                }
            }
            const roomClientCheck = new TableClient(this.tableUrl, constants.ROOM_TABLE_NAME, this.credential);
            const roomFound = roomClientCheck.listEntities(listEntititesOptions);
            if (roomFound && roomFound.byPage.length) {
                for await (const entity of roomFound) {
                    return this.getDBRoomEntity(entity);
                }
            }

            const client = new TableClient(this.tableUrl, constants.ROOM_TABLE_NAME, this.credential);
            const dbEntity: IDBRoomAdd = {
                partitionKey: room.displayName,
                rowKey: room.id,
                displayName: room.displayName,
                building: room.building,
                capacity: room.capacity,
                emailAddress: room.emailAddress,
                id: room.id
            };
            await client.createEntity(dbEntity);
            return this.getDBRoomEntity(dbEntity);
        }
        catch (error) {
            throw error;
        }
    }

    private async addEvent(event: IEventAdd): Promise<IDBEvent> {
        try {
            // return event if exists
            if (event.id) {
                const listEntititesOptions: ListTableEntitiesOptions = {
                    queryOptions: {
                        filter: `id eq '${event.id}' and adHoc eq false`
                    }
                }
                const eventClientCheck = new TableClient(this.tableUrl, constants.EVENT_TABLE_NAME, this.credential);
                const eventFound = eventClientCheck.listEntities(listEntititesOptions);
                if (eventFound && eventFound.byPage.length) {
                    for await (const entity of eventFound) {
                        return this.getDBEventEntity(entity);
                    }
                }
            }

            const currentDate = moment().toISOString();
            const currentDateNextHour = moment().add(1, 'hours').toISOString();
            const eventSubject = event.subject ?? constants.ADHOC_EVENT_NAME;

            // add ad-hoc event always
            const client = new TableClient(this.tableUrl, constants.EVENT_TABLE_NAME, this.credential);
            const dbEntity: IDBEventAdd = {
                partitionKey: eventSubject as string,
                rowKey: uuidv4(),
                subject: eventSubject as string,
                start: event.start ?? currentDate as string,
                end: event.end ?? currentDateNextHour as string,
                locationDisplayName: event.locationDisplayName as string,
                locationEmail: event.locationEmail as string,
                id: event.id ?? "" as string,
                adHoc: event.id ? false : true as boolean
            };
            await client.createEntity(dbEntity);
            return this.getDBEventEntity(dbEntity);
        }
        catch (error) {
            throw error;
        }
    }

    public async getCheckedInUsers(roomId: string, eventId: string): Promise<IDBUser[]> {
        try {
            const checkInlistEntititesOptions: ListTableEntitiesOptions = {
                queryOptions: {
                    filter: `roomId eq '${roomId}' and eventId eq '${eventId}'`
                }
            }
            const checkInClient = new TableClient(this.tableUrl, constants.CHECKIN_TABLE_NAME, this.credential);
            const roomCheckIns = await checkInClient.listEntities(checkInlistEntititesOptions);
            const userIds: string[] = [];
            for await (const entity of roomCheckIns) {
                userIds.push(`RowKey eq '${entity["userId"]}'` as string);
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
                let user = this.getDBUserEntity(entity);
                roomUsers.push(user);
            }

            return roomUsers;
        }
        catch (error) {
            console.error(error.stack);
            return (error);
        }
    }

    private getDBRoomEntity(entity: TableEntityResult<Record<string, unknown>> | IDBRoomAdd): IDBRoom {
        if (instanceOfIDBRoomAdd(entity)) {
            return entity as IDBRoom;
        }
        else {
            return {
                partitionKey: entity.partitionKey as string,
                rowKey: entity.rowKey as string,
                displayName: entity["displayName"] as string,
                emailAddress: entity["emailAddress"] as string ?? "",
                phone: entity["phone"] as string ?? "",
                capacity: entity["capacity"] as number ?? "",
                building: entity["building"] as string ?? "",
                id: entity["id"] as string
            } as IDBRoom;
        }
    }

    private getDBEventEntity(entity: TableEntityResult<Record<string, unknown>> | IDBEventAdd): IDBEvent {
        if (instanceOfIDBEventAdd(entity)) {
            return entity as IDBEvent;
        }
        else {
            return {
                partitionKey: entity.partitionKey as string,
                rowKey: entity.rowKey as string,
                subject: entity["subject"] as string,
                start: entity["start"] as string ?? "",
                end: entity["end"] as string ?? "",
                locationDisplayName: entity["locationDisplayName"] as string ?? "",
                locationEmail: entity["locationEmail"] as string ?? "",
                id: entity["id"] as string ?? "",
                adHoc: entity["adHoc"] as boolean ?? false,
            } as IDBEvent;
        }
    }

    private getDBUserEntity(entity: TableEntityResult<Record<string, unknown>> | IDBUserAdd): IDBUser {
        if (instanceOfIDBUserAdd(entity)) {
            return entity as IDBUser;
        }
        else {
            return {
                partitionKey: entity.partitionKey as string,
                rowKey: entity.rowKey as string,
                displayName: entity["displayName"] as string,
                principalName: entity["principalName"] as string ?? "",
                mail: entity["mail"] as string ?? "",
                phone: entity["phone"] as string ?? "",
                employeeId: entity["employeeId"] as string ?? "",
                id: entity["id"] as string ?? "",
                external: entity["external"] as boolean ?? false
            } as IDBUser;
        }
    }
}

export default new dataTableStorageService();
