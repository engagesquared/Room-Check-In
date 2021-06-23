import { azureDataTableAppSetting } from "../../appSettings";
import { constants } from "../../constants";
import { ICheckIn as CheckedIn } from "../../interfaces/response/ICheckIn";
import { ICheckIn } from "../../interfaces/request/ICheckIn";
import {v4 as uuidv4} from 'uuid';

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
                const dbEntity = {
                    partitionKey: checkIn.room.displayName,
                    rowKey: uuidv4(),
                    user: {
                        principalName: checkIn.user.userPrincipalName,
                        displayName: checkIn.user.displayName,
                        email: checkIn.user.mail
                    },
                    room: {
                        id: checkIn.room.id,
                        displayName: checkIn.room.displayName
                    }
                };
                await client.createEntity(dbEntity);
            }); 
        }
        catch (error) {
            throw error;
        }
    }

    public async getCheckedInUsersInRoom(roomId: number): Promise<CheckedIn> {
        return await {
            user: {
                id:"",
                userPrincipalName: "ted@a830edad905084922E17020313.onmicrosoft.com",
                displayName: "Ted CheckedIn",
                mail: "ted@a830edad905084922E17020313.onmicrosoft.com"
            },
            room: {
                id: "3162F1E1-C4C0-604B-51D8-91DA78989EB1",
                displayName: "roome#1",
                building: "bulding#1",
                emailAddress: "ted@a830edad905084922E17020313.onmicrosoft.com",
                capacity:10,
                isWheelChairAccessible:true
            }
        }
    }
}
export default new dataTableStorageService();