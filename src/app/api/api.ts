import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { relocateToLoginPage } from '../utils/navigationUtils';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import { isUnauthorized, isForbidden } from '@navikt/sif-common-core/lib/utils/apiUtils';

const defaultAxiosConfig = {
    withCredentials: true,
};

axios.defaults.baseURL = getEnvironmentVariable('API_URL');
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
    return config;
});
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (isForbidden(error) || isUnauthorized(error)) {
            relocateToLoginPage();
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export enum ApiEndpoint {
    'soker' = 'soker',
    'mellomlagring' = 'mellomlagring',
}

const api = {
    get: <ResponseType>(endpoint: ApiEndpoint, paramString?: string, config?: AxiosRequestConfig) => {
        const url = `${endpoint}${paramString ? `?${paramString}` : ''}`;
        return axios.get<ResponseType>(url, config || defaultAxiosConfig);
    },
    post: <DataType = any, ResponseType = any>(endpoint: ApiEndpoint, data: DataType) =>
        axios.post<ResponseType>(endpoint, data, defaultAxiosConfig),
};

export default api;
