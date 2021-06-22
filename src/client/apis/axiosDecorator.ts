// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { constants } from "../../constants";
import { getClientSideToken } from "../services/AuthService";

export class AxiosDecorator {
    public async get<T = any, R = AxiosResponse<T>>(
        url: string,
        needAuthorizationHeader: boolean = true,
        config?: AxiosRequestConfig,
    ): Promise<R> {
        try {
            if (needAuthorizationHeader) {
                config = await this.setupAuthorizationHeader(config);
            }
            return await axios.get(url, config);
        } catch (error) {
            throw error;
        }
    }

    public async delete<T = any, R = AxiosResponse<T>>(
        url: string,
        needAuthorizationHeader: boolean = true,
        config?: AxiosRequestConfig
    ): Promise<R> {
        try {
            if (needAuthorizationHeader) {
                config = await this.setupAuthorizationHeader(config);
            }
            return await axios.delete(url, config);
        } catch (error) {
            throw error;
        }
    }

    public async post<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: any,
        needAuthorizationHeader: boolean = true,
        config?: AxiosRequestConfig
    ): Promise<R> {
        try {
            if (needAuthorizationHeader) {
                config = await this.setupAuthorizationHeader(config);
            }
            return await axios.post(url, data, config);
        } catch (error) {
            throw error;
        }
    }

    public async put<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: any,
        needAuthorizationHeader: boolean = true,
        config?: AxiosRequestConfig
    ): Promise<R> {
        try {
            if (needAuthorizationHeader) {
                config = await this.setupAuthorizationHeader(config);
            }
            return await axios.put(url, data, config);
        } catch (error) {
            throw error;
        }
    }

    private async setupAuthorizationHeader(config?: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        if (!config) {
            config = axios.defaults;
        }
        const token = await getClientSideToken();
        config.headers[constants.APP_ACCESS_TOKEN_HEADER] = token;

        return config;
  }
}

const axiosDecoratorInstance = new AxiosDecorator();
export default axiosDecoratorInstance;