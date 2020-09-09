import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { AxiosResponse } from 'axios';
import { ApiEndpoint, defaultAxiosConfig } from '../api/api';
import { SoknadFormData } from '../types/SoknadFormData';
import { StepID } from './StepID';

export interface SoknadTemporaryStorageData {
    metadata: {
        lastStepID: StepID;
        version: string;
    };
    formData: SoknadFormData;
}

export const STORAGE_VERSION = '1.0';

interface SoknadTemporaryStorage extends Omit<PersistenceInterface<SoknadTemporaryStorageData>, 'persist'> {
    persist: (formData: Partial<SoknadFormData>, lastStepID: StepID) => Promise<AxiosResponse>;
}

const persistSetup = persistence<SoknadTemporaryStorageData>({
    url: ApiEndpoint.mellomlagring,
    requestConfig: { ...defaultAxiosConfig },
});

export const isStorageDataValid = (data: SoknadTemporaryStorageData): SoknadTemporaryStorageData | undefined => {
    if (
        data?.metadata?.version === STORAGE_VERSION &&
        data?.metadata.lastStepID !== undefined &&
        data.formData !== undefined &&
        JSON.stringify(data.formData) !== JSON.stringify({})
    ) {
        return data;
    }
    return undefined;
};

const soknadTempStorage: SoknadTemporaryStorage = {
    persist: (formData: SoknadFormData, lastStepID: StepID) => {
        return persistSetup.persist({
            formData,
            metadata: { lastStepID, version: STORAGE_VERSION },
        });
    },
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate,
};

export default soknadTempStorage;
