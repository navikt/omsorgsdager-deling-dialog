import { useEffect, useState } from 'react';
import { isForbidden, isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import { getSoker } from '../api/getSoker';
import { SoknadEssentials } from '../types/SoknadEssentials';

export interface Person {
    etternavn: string;
    fornavn: string;
    mellomnavn?: string;
    kjønn: string;
    fødselsnummer: string;
    kontonummer: string;
}

function useSoknadEssentials() {
    const [soknadEssentials, setSoknadEssentials] = useState<SoknadEssentials | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>();
    const [userIsUnauthorized, setUserIsUnauthorized] = useState<boolean | undefined>();

    const fetch = async () => {
        setSoknadEssentials(undefined);
        setError(undefined);
        setIsLoading(true);
        try {
            const person = await getSoker();
            setSoknadEssentials({
                person,
            });
        } catch (error) {
            if (isForbidden(error) || isUnauthorized(error)) {
                setUserIsUnauthorized(true);
            } else {
                setError(error || new Error('SoknadEssentials load failed'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    return {
        soknadEssentials,
        userIsUnauthorized,
        isLoading,
        error,
        fetch,
    };
}

export default useSoknadEssentials;
