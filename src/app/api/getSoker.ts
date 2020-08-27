import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { Person } from '../types/Person';
import api, { ApiEndpoint } from './api';

export type SokerRemoteData = RemoteData<AxiosError, Person>;

const getSoker = async (): Promise<SokerRemoteData> => {
    try {
        const { data } = await api.get<Person>(ApiEndpoint.soker);
        return Promise.resolve(success(data));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getSoker;
