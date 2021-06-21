import { azureDataTableAppSetting } from "../../appSettings";
import { constants } from "../../constants";
import { ICheckedInUser } from "../../interfaces/ICheckedInUser";
import { ICheckInUser } from "../../interfaces/ICheckInUser";

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

    public async checkInUser(checkInUser: ICheckInUser) {
        try {
            const client = new TableClient(`https://${azureDataTableAppSetting.accountName}.table.core.windows.net`, constants.CHECKIN_TABLE_NAME, this.credential);
            const testEntity = {
                partitionKey: "P1",
                rowKey: "R1",
                displayName: "",
                email: "foo",
                roomId: 123,
                roomName: ""
            };
            await client.createEntity(testEntity);
        }
        catch (error) {
            throw error;
        }
    }

    public async getCheckedInUsersInRoomId(roomId: number): Promise<ICheckedInUser> {
        return await {
            displayName: "Ted CheckedIn",
            email: "ted@a830edad905084922E17020313.onmicrosoft.com",
            roomId: "3162F1E1-C4C0-604B-51D8-91DA78989EB1",
            roomDisplayName: "roome#1",
            roomBuilding: "bulding#1"
        }
    }
}
export default new dataTableStorageService();