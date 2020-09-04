import React from 'react';
import RemoteDataHandler from '../../common/application-setup/RemoteDataHandler';
import ErrorPage from '../../common/pages/ErrorPage';
import LoadingPage from '../../common/pages/LoadingPage';
import useSoknadEssentials, { CombinedType } from '../hooks/useSoknadEssentials';
import { initialSoknadFormData } from '../types/SoknadFormData';
import SoknadFormComponents from './SoknadFormComponents';
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
            success={([person, barn, mellomlagring]) => (
                <SoknadFormComponents.FormikWrapper
                    initialValues={initialSoknadFormData}
                    onSubmit={() => null}
                    renderForm={() => {
                        return <SoknadRoutes person={person} barn={barn} mellomlagring={mellomlagring} />;
                    }}></SoknadFormComponents.FormikWrapper>
            )}
        />
    );
};

export default Soknad;
