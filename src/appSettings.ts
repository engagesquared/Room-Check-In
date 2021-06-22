
export const authAppSetting = {
    clientId: process.env.AUTH_APP_CLIENTID?.trim() || "",
    clientSecret: process.env.AUTH_APP_CLIENTSECRET?.trim() || "",
    authority: `${process.env.AUTH_AUTHORITYHOSTURL?.trim()}/${process.env.AUTH_TENANTID?.trim()}/`,
}

export const keyVaultAppSetting = {
    url: process.env.KEY_VAULT_URL?.trim(),
    secretName: process.env.KEY_VAULT_SECRET_NAME?.trim()
};

export const azureDataTableAppSetting = {
    accountName: process.env.STORAGE_ACCOUNT_NAME?.trim(),
    accountKey: process.env.STORAGE_ACCOUNT_KEY?.trim()
};

export const usersAppSetting = {
    apiUrl: process.env.USERS_GRAPH_API_URL?.trim()
};

export const eventAppSetting = {
    apiUrl: process.env.EVENT_GRAPH_API_URL?.trim()
};

export const placesAppSetting = {
    apiUrl: process.env.PLACES_GRAPH_API_URL?.trim()
};