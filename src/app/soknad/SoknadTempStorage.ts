import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { AxiosResponse } from 'axios';
import * as hash from 'object-hash';
import { ApiEndpoint, defaultAxiosConfig } from '../api/api';
import { Person } from '../types/Person';
import { Barn, SoknadFormData } from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { StepID } from './soknadStepsConfig';

export const STORAGE_VERSION = '1.0';

interface UserHashInfo {
    søker: Person;
    barn: Barn[];
}

interface SoknadTemporaryStorage extends Omit<PersistenceInterface<SoknadTempStorageData>, 'persist'> {
    persist: (
        soknadId: string,
        formData: Partial<SoknadFormData>,
        lastStepID: StepID,
        søkerInfo: UserHashInfo
    ) => Promise<AxiosResponse>;
}

const persistSetup = persistence<SoknadTempStorageData>({
    url: ApiEndpoint.mellomlagring,
    requestConfig: { ...defaultAxiosConfig },
});

export const isStorageDataValid = (
    data: SoknadTempStorageData,
    userHashInfo: UserHashInfo
): SoknadTempStorageData | undefined => {
    if (
        data?.metadata?.version === STORAGE_VERSION &&
        data?.metadata.lastStepID !== undefined &&
        data.formData !== undefined &&
        data.metadata.soknadId !== undefined &&
        JSON.stringify(data.formData) !== JSON.stringify({}) &&
        hash(userHashInfo) === data.metadata.userHash
    ) {
        return data;
    }
    return undefined;
};

const soknadTempStorage: SoknadTemporaryStorage = {
    persist: (soknadId: string, formData: SoknadFormData, lastStepID: StepID, userHashInfo: UserHashInfo) => {
        return persistSetup.persist({
            formData,
            metadata: { soknadId, lastStepID, version: STORAGE_VERSION, userHash: hash(userHashInfo) },
        });
    },
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate,
};

export default soknadTempStorage;
