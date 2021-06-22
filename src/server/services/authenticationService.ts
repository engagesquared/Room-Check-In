import * as msal from "@azure/msal-node";
import { authAppSetting } from '../../appSettings';
import { constants } from '../../constants';

export default class AuthenticationService {
    public static async getAccessToken(ssoToken: string): Promise<string> {
        try {
            console.log(`getAccessToken::getting access token`);
            const msalConfig = {
                auth: {
                    clientId: authAppSetting.clientId,
                    clientSecret: authAppSetting.clientSecret,
                    authority: authAppSetting.authority,
                }
            };
            const cca = new msal.ConfidentialClientApplication(msalConfig);

            const result = await cca.acquireTokenOnBehalfOf({
                oboAssertion: ssoToken,
                scopes: constants.AUTH_SCOPES
            });
            console.log(`getAccessToken::token is returned successfully`);
            return result?.accessToken ?? "";
        }
        catch (error) {
            throw (`getAccessToken::${error}`);
        }
    }
}