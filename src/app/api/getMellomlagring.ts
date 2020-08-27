import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import StorageData from '../types/StorageData';
import api, { ApiEndpoint } from './api';

export type MellomlagringRemoteData = RemoteData<AxiosError<any>, StorageData>;

const getMellomlagring = async (): Promise<MellomlagringRemoteData> => {
    try {
        const { data } = await api.get<any>(ApiEndpoint.mellomlagring);
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getMellomlagring;
