import msal = require('@azure/msal-node');
import { authAppSetting } from '../appSettings';

export class authenticationService {
    private privateKey: string;
    constructor(privateKey: string) {
        this.privateKey = privateKey;
    }

    public async getAppOnlyAccessToken(): Promise<string> {
        try {
            console.log(`getAppOnlyAccessToken::getting access token`);
            const msalConfig = {
                auth: {
                    clientId: authAppSetting.clientId, //"AUTH_CLIENTID": "469a8a3f-7865-48dd-b329-9d81bf2dc04b",
                    clientCertificate: {
                        thumbprint: authAppSetting.clientCertificate.thumbprint,
                        privateKey: this.privateKey
                    },
                    authority: authAppSetting.authority,
                    knownAuthorities: authAppSetting.knownAuthorities,
                    redirectUri: authAppSetting.redirectUri
                }
            };
            const cca = new msal.ConfidentialClientApplication(msalConfig);
            const clientCredentialRequest = {
                scopes: ["User.Read", "Place.Read.All", "Calendars.Read", "Calendars.ReadWrite"]
            };

            let response = await cca.acquireTokenByClientCredential(clientCredentialRequest)
            console.log(`getAppOnlyAccessToken::token is returned successfully`);

            return response.accessToken ?? null;
        }
        catch (error) {
            throw (`getAppOnlyAccessToken::${error}`);
        }
    }

}