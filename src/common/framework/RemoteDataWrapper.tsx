import React from 'react';
import { fold } from '@devexperts/remote-data-ts';

interface Props<T> {
    data: any;
    initializing: () => React.ReactNode;
    loading: () => React.ReactNode;
    error: () => React.ReactNode;
    success: (result: T) => React.ReactNode;
}

function RemoteDataWrapper<T>({ data, initializing, loading, error, success }: Props<T>) {
    return <>{fold(initializing, loading, error, success)(data)}</>;
}

export default RemoteDataWrapper;
