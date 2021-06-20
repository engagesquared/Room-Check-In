export class utilities {
    static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static throwGraphAPIError(methodName: string, error: any) {
        if (error.response && error.response.data.error && error.response.data.error.message) {
            throw `${methodName}-${error.response.data.error.message}`;
        }
        else if (error.message) {
            throw `${methodName}-${error.message}`;
        }
        else {
            throw `${methodName}-${error}`;
        }
    }

    static throwAPIError(methodName: string, error: any) {
        if (error.response && error.response.data) {
            throw `${methodName}-${error.response.data}`;
        }
        else if (error.message) {
            throw `${methodName}-${error.message}`;
        }
        else if (error.response && error.response.bodyAsText) {
            throw `${methodName}-${error.response.bodyAsText}`;
        }
        else {
            throw `${methodName}-${error}`;
        }
    }
    
    static getGraphAPIError(methodName: string, error: any) {
        if (error.response && error.response.data.error && error.response.data.error.message) {
            return `${methodName}-${error.response.data.error.message}`;
        }
        else if (error.message) {
            return `${methodName}-${error.message}`;
        }
        else {
            return `${methodName}-${error}`;
        }
    }
}