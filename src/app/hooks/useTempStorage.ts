import { useState } from 'react';
import soknadTempStorage, { SoknadTemporaryStorageData } from '../soknad/SoknadTempStorage';

function useTemporaryStorage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [storageData, setStorageData] = useState<SoknadTemporaryStorageData | undefined>();

    async function fetchStorage() {
        setIsLoading(true);
        try {
            const storageData = await soknadTempStorage.rehydrate();
            setStorageData(storageData ? storageData.data : undefined);
        } catch (error) {
            setStorageData(undefined);
        } finally {
            setIsLoading(false);
        }
    }

    const fetch = () => {
        fetchStorage();
    };

    async function purge() {
        setIsLoading(true);
        try {
            await soknadTempStorage.purge();
        } finally {
            setStorageData(undefined);
            setIsLoading(false);
        }
    }

    return { storageData, isLoading, purge, fetch };
}

export default useTemporaryStorage;
