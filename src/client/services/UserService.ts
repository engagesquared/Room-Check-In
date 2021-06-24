import { constants } from "../../constants";
import axios from "axios";
import { IUser } from '../../interfaces/IUser';
import { getClientSideToken } from "./AuthService";

export const getLoggedInUserDetails = async (): Promise<IUser | undefined> => {
    try {
        const clientSideToken = await getClientSideToken();
        const res: any = await axios.get(`/api/loggedInUserDetails`
            , { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
        return res?.data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}