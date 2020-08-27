import { useEffect, useState } from 'react';
import { combine, pending, RemoteData } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import getMellomlagring from '../api/getMellomlagring';
import getSokerRemoteData from '../api/getSoker';
import { Person } from '../types/Person';
import StorageData from '../types/StorageData';
import { isForbidden, isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';

export type CombinedType = [Person, StorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, CombinedType>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(pending);

    const fetch = async () => {
        try {
            const [sokerResult, mellomlagringResult] = await Promise.all([getSokerRemoteData(), getMellomlagring()]);
            setData(combine(sokerResult, mellomlagringResult));
        } catch (e) {
            if (!isForbidden(e.error) && !isUnauthorized(e.error)) {
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
