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
import { IDBAttendee } from "../../interfaces/IDBAttendee";

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
                const userId = await this.addUser(checkIn.user);
                const roomId = await this.addRoom(checkIn.room);
                const eventId = await this.addEvent(checkIn.event);
                const attendeeIds = await this.addAttendees(eventId, checkIn.event.attendees);

                const dbEntity = {
                    PartitionKey: checkIn.room.displayName,
                    RowKey: uuidv4(),
                    EventId: eventId,
                    RoomId: roomId,
                    UserId:userId,
                    UserDisplayName: checkIn.user.displayName
                };
                await client.createEntity(dbEntity);
            });
        }
        catch (error) {
            throw error;
        }
    }

    private async addUser(user: IUser) : Promise<string>{
        try {
            const id = uuidv4();
            const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.USER_TABLE_NAME, this.credential);
            const dbEntity = {
                PartitionKey: user.displayName,
                RowKey: id,
                DisplayName: user.displayName,
                PrincipalName: user.userPrincipalName,
                Email: user.mail,
                Id: id
            };
            await client.createEntity(dbEntity);
            return id;
        }
        catch (error) {
            throw error;
        }
    }

    private async addRoom(room: IRoom) : Promise<string>{
        try {
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

    private async addEvent(event: IEvent) : Promise<string>{
        try {
            const id = uuidv4();
            const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.ROOM_TABLE_NAME, this.credential);
            const dbEntity = {
                PartitionKey: event.subject,
                RowKey: id,
                Subject: event.subject,
                StartTime: event.start,
                EndTime:event.end,
                LocationDisplayName:event.location.displayName,
                LocationEmail:event.location.locationEmailAddress,
                Id: id
            };
            await client.createEntity(dbEntity);
            return id;
        }
        catch (error) {
            throw error;
        }
    }

    private async addAttendees(eventId:string, attendees: IAttendee[]) : Promise<string[]> {
        try {
            const ids: string[]=[];
            const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.CHECKIN_TABLE_NAME, this.credential);
            attendees.forEach(async attendee => {
                const id = uuidv4();
                const dbEntity = {
                    partitionKey: attendee.emailAddress.name,
                    rowKey: id,
                    EventId: eventId,
                    DisplayName: attendee.emailAddress.name,
                    Email: attendee.emailAddress.address,
                    Id: id
                };
                await client.createEntity(dbEntity);
                ids.push(id);
            });

            return ids;
        }
        catch (error) {
            throw error;
        }
    }

    public async getCheckedInUsersInRoom(roomId: string): Promise<IDBAttendee[]> {
        return await [{
            eventId:"",
            displayName:"",
            email:"",
            id:""
        },
        {
            eventId:"",
            displayName:"",
            email:"",
            id:""
        },
        {
            eventId:"",
            displayName:"",
            email:"",
            id:""
        }];

        const checkInClient = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.CHECKIN_TABLE_NAME, this.credential); 
        const checkInEntities:IDBCheckIn[] = await checkInClient.listEntities();
        const checkInEntity:IDBCheckIn | undefined = checkInEntities.find((e)=>{return e.roomId == roomId});

        const eventClient = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.EVENT_TABLE_NAME, this.credential); 
        const eventEntities:IDBEvent[] = await eventClient.listEntities();
        const eventEntity: IDBEvent | undefined = eventEntities.find((e)=>{return e.id == checkInEntity?.eventId});

        const attendeeClient = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.ATTENDEE_TABLE_NAME, this.credential);
        const attendeeEntities:IDBAttendee[] = await attendeeClient.listEntities();

        return attendeeEntities.filter((a)=>{return a.eventId == eventEntity?.id});
    }
}
export default new dataTableStorageService();