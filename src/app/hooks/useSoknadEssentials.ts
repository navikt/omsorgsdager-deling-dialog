import { useEffect, useState } from 'react';
import { combine, pending, RemoteData } from '@devexperts/remote-data-ts';
import { isUserLoggedOut } from '@sif-common-core/utils/apiUtils';
import { AxiosError } from 'axios';
import getMellomlagring from '../api/getMellomlagring';
import getSokerRemoteData from '../api/getSoker';
import { Person } from '../types/Person';
import StorageData from '../types/StorageData';

export type CombinedType = [Person, StorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, CombinedType>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(pending);
    const fetch = async () => {
        try {
            const [sokerResult, mellomlagringResult] = await Promise.all([getSokerRemoteData(), getMellomlagring()]);
            setData(combine(sokerResult, mellomlagringResult));
        } catch (e) {
            if (isUserLoggedOut(e) === false) {
                setData(e);
            }
        }
    };
    useEffect(() => {
        fetch();
    }, []);
    return data;
}

export default useSoknadEssentials;
