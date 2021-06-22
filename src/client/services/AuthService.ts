import * as microsoftTeams from "@microsoft/teams-js";
import { constants } from "../../constants";
import axios from "axios";


let clientSideTokenCached: string = "";
let clientSideTokenCachedTime: Date | undefined;
let serverSideTokenCached: string = "";
let serverSideTokenCachedTime: Date | undefined;

export const getClientSideToken = async (): Promise<string> => {
    // TODO: cache token in localstorage
    if (!clientSideTokenCachedTime || +new Date() - +clientSideTokenCachedTime > 1 * 60 * 1000) {
        return new Promise((res) => {
            microsoftTeams.authentication.getAuthToken({
                successCallback: (token: string) => {
                    clientSideTokenCachedTime = new Date();
                    clientSideTokenCached = token;
                    res(clientSideTokenCached);
                    microsoftTeams.appInitialization.notifySuccess();
                },
                failureCallback: (message: string) => {
                    microsoftTeams.appInitialization.notifyFailure({
                        reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                        message
                    });
                },
                resources: [process.env.AUTH_APP_URI as string]
            });
        });
    }

    return clientSideTokenCached;
}

export const getServerSideToken = async (): Promise<string> => {
    if (!serverSideTokenCachedTime || +new Date() - +serverSideTokenCachedTime > 1 * 60 * 1000) {
        const clientSideToken = await getClientSideToken();
        const res = await axios.get("/api/token", { headers: { [constants.APP_ACCESS_TOKEN_HEADER]: clientSideToken } });
        serverSideTokenCachedTime = new Date();
        serverSideTokenCached = res.data;
    }
    return serverSideTokenCached;
}

