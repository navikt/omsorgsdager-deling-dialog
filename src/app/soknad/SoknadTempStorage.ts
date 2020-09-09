import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { AxiosResponse } from 'axios';
import * as hash from 'object-hash';
import { ApiEndpoint, defaultAxiosConfig } from '../api/api';
import { Person } from '../types/Person';
import { Barn, SoknadFormData } from '../types/SoknadFormData';
import { StepID } from './StepID';

export interface SoknadTemporaryStorageData {
    metadata: {
        lastStepID: StepID;
        version: string;
        userHash: string;
    };
    formData: SoknadFormData;
}

export const STORAGE_VERSION = '1.0';

interface UserHashInfo {
    søker: Person;
    barn: Barn[];
}

interface SoknadTemporaryStorage extends Omit<PersistenceInterface<SoknadTemporaryStorageData>, 'persist'> {
    persist: (formData: Partial<SoknadFormData>, lastStepID: StepID, søkerInfo: UserHashInfo) => Promise<AxiosResponse>;
}

const persistSetup = persistence<SoknadTemporaryStorageData>({
    url: ApiEndpoint.mellomlagring,
    requestConfig: { ...defaultAxiosConfig },
});

export const isStorageDataValid = (
    data: SoknadTemporaryStorageData,
    userHashInfo: UserHashInfo
): SoknadTemporaryStorageData | undefined => {
    if (
        data?.metadata?.version === STORAGE_VERSION &&
        data?.metadata.lastStepID !== undefined &&
        data.formData !== undefined &&
        JSON.stringify(data.formData) !== JSON.stringify({}) &&
        hash(userHashInfo) === data.metadata.userHash
    ) {
        return data;
    }
    return undefined;
};

const soknadTempStorage: SoknadTemporaryStorage = {
    persist: (formData: SoknadFormData, lastStepID: StepID, userHashInfo: UserHashInfo) => {
        return persistSetup.persist({
            formData,
            metadata: { lastStepID, version: STORAGE_VERSION, userHash: hash(userHashInfo) },
        });
    },
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate,
};

export default soknadTempStorage;
