import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";
import axios from "axios";


let clientSideTokenCacheKey: string = "e2_check-in-app-client-side-token";
let serverSideTokenCacheKey: string = "e2_check-in-app-server-side-token";

export const getClientSideToken = async (): Promise<string> => {
    let clientSideTokenExpirationTime: number | undefined;
    const token = localStorage.getItem(clientSideTokenCacheKey);
    if (token) {
        const tokenDecoded = jwtDecode(token) as any;
        clientSideTokenExpirationTime = tokenDecoded.exp * 1000;
    }
    if (!token || !clientSideTokenExpirationTime || +clientSideTokenExpirationTime - +new Date() < 60 * 1000) {
        return new Promise((res) => {
            microsoftTeams.authentication.getAuthToken({
                successCallback: (newToken: string) => {
                    localStorage.setItem(clientSideTokenCacheKey, newToken);
                    res(newToken);
                    microsoftTeams.appInitialization.notifySuccess();
                },
                failureCallback: (message: string) => {
                    localStorage.removeItem(clientSideTokenCacheKey);
                    microsoftTeams.appInitialization.notifyFailure({
                        reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                        message
                    });
                },
                resources: [process.env.AUTH_APP_URI as string]
            });
        });
    }

    return token;
}

export const getServerSideToken = async (): Promise<string> => {
    let serverSideTokenExpirationTime: number | undefined;
    const token = localStorage.getItem(serverSideTokenCacheKey);
    if (token) {
        const tokenDecoded = jwtDecode(token) as any;
        serverSideTokenExpirationTime = tokenDecoded.exp * 1000;
    }
    if (!token || !serverSideTokenExpirationTime || +serverSideTokenExpirationTime - +new Date() < 60 * 1000) {
        const clientSideToken = await getClientSideToken();
        const res = await axios.post("/api/token", { ssoToken: clientSideToken });
        const newToken = res.data;
        localStorage.setItem(serverSideTokenCacheKey, newToken);
        return newToken;
    }
    
    return token;
}

