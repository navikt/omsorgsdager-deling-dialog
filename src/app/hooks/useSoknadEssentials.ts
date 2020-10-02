import { useEffect, useState } from 'react';
import { combine, initial, pending, RemoteData } from '@devexperts/remote-data-ts';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import getBarnRemoteData from '../api/getBarn';
import getMellomlagring from '../api/getMellomlagring';
import getSokerRemoteData from '../api/getSoker';
import { SoknadTemporaryStorageData } from '../soknad/SoknadTempStorage';
import { Person } from '../types/Person';
import { Barn } from '../types/SoknadFormData';
import { relocateToLoginPage } from '../utils/navigationUtils';

export type SoknadEssentials = [Person, Barn[], SoknadTemporaryStorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, SoknadEssentials>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(initial);
    const fetch = async () => {
        try {
            const [sokerResult, barnResult, mellomlagringResult] = await Promise.all([
                getSokerRemoteData(),
                getBarnRemoteData(),
                getMellomlagring(),
            ]);
            setData(combine(sokerResult, barnResult, mellomlagringResult));
        } catch (remoteDataError) {
            if (isUserLoggedOut(remoteDataError.error)) {
                setData(pending);
                relocateToLoginPage();
            } else {
                setData(remoteDataError);
            }
        }
    };
    useEffect(() => {
        fetch();
    }, []);
    return data;
}

export default useSoknadEssentials;
