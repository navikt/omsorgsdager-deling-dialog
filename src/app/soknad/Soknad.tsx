import React from 'react';
import LoadingPage from '../../common/pages/LoadingPage';
import RemoteDataHandler from '../../common/application-setup/RemoteDataHandler';
import ErrorPage from '../../common/pages/ErrorPage';
import useSoknadEssentials, { CombinedType } from '../hooks/useSoknadEssentials';
import SoknadRoutes from './SoknadRoutes';
import SoknadFormComponents from './SoknadFormComponents';
import { initialSoknadFormData } from '../types/SoknadFormData';

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
            success={([person, mellomlagring]) => (
                <SoknadFormComponents.FormikWrapper
                    initialValues={initialSoknadFormData}
                    onSubmit={() => null}
                    renderForm={() => {
                        return <SoknadRoutes person={person} mellomlagring={mellomlagring} />;
                    }}></SoknadFormComponents.FormikWrapper>
            )}
        />
    );
};

export default Soknad;
