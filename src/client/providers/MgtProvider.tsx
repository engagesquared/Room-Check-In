import { SimpleProvider, ProviderState } from "@microsoft/mgt-react";
import { getServerSideToken } from "../services/AuthService";

let tokenCached: string = "";
let cachedTime: Date | undefined;
let getTokenFunc: Promise<string> | undefined;

export class MgtTokenProvider extends SimpleProvider {
    constructor() {
        super(async (scopes) => "");
        this.setState(ProviderState.SignedIn);
    }

    public async getAccessToken(options?: { scopes?: string[] }): Promise<string> {
        if (!cachedTime || +new Date() - +cachedTime > 1 * 60 * 1000) {
            if (!getTokenFunc) {
                getTokenFunc = (async () => {
                    const data = await getServerSideToken();
                    getTokenFunc = undefined;
                    return data;
                })();
            }
            tokenCached = await getTokenFunc;
        }
        return tokenCached;
    }
}
