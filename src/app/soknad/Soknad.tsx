import React from 'react';
import LoadingPage from '../../common/framework/LoadingPage';
import RemoteDataHandler from '../../common/framework/RemoteDataHandler';
import ErrorPage from '../../common/pages/ErrorPage';
import useSoknadEssentials, { CombinedType } from '../hooks/useSoknadEssentials';
import SoknadRoutes from './SoknadRoutes';

const Soknad = () => {
    const soknadEssentials = useSoknadEssentials();
    return (
        <RemoteDataHandler<CombinedType>
            remoteData={soknadEssentials}
            initializing={() => <LoadingPage />}
            loading={() => <LoadingPage />}
            error={(error) => (
                <ErrorPage
                    contentRenderer={() => (
                        <>
                            Det oppstod en feil under henting av informasjon: <pre>{JSON.stringify(error.message)}</pre>
                        </>
                    )}
                />
            )}
            success={([person, mellomlagring]) => <SoknadRoutes person={person} mellomlagring={mellomlagring} />}
        />
    );
};

export default Soknad;
