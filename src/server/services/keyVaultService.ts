import { keyVaultAppSetting } from "../../appSettings";
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

class keyVaultService {
    private keyVaultUrl: string;
    private keyVaultSecretName: string;

    constructor() {
        try {
            this.keyVaultUrl = keyVaultAppSetting.url;
            this.keyVaultSecretName = keyVaultAppSetting.secretName;
        }
        catch (error) {
            throw error;
        }
    }

    public async getPrivateKey(): Promise<string> {
        try {
            console.log(`getPrivateKey::getting private key from key-vault`);
            const credential = new DefaultAzureCredential();
            const clientSec = new SecretClient(this.keyVaultUrl, credential);
            const secret = await clientSec.getSecret(this.keyVaultSecretName);

            console.log(`getPrivateKey::private key returned from key-vault successfully`);
            return secret.value!;
        }
        catch (error) {
            throw (`getPrivateKey::${error}`);
        }
    }
}

export default new keyVaultService();