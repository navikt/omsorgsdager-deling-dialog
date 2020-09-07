import { useEffect, useState } from 'react';
import { combine, pending, RemoteData } from '@devexperts/remote-data-ts';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import getMellomlagring from '../api/getMellomlagring';
import getSokerRemoteData from '../api/getSoker';
import { Person } from '../types/Person';
import StorageData from '../types/StorageData';
import getBarnRemoteData from '../api/getBarn';
import { Barn } from '../types/SoknadFormData';
import { relocateToLoginPage } from '../utils/navigationUtils';

export type CombinedType = [Person, Barn[], StorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, CombinedType>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(pending);
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
