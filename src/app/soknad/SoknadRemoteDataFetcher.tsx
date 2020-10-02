import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import RemoteDataHandler from '../../common/remote-data-handler/RemoteDataHandler';
import ErrorPage from '../../common/soknad-common-pages/ErrorPage';
import LoadingPage from '../../common/soknad-common-pages/LoadingPage';
import useSoknadEssentials, { SoknadEssentials } from '../hooks/useSoknadEssentials';
import Soknad from './Soknad';
import SoknadErrorMessages from '../../common/soknad-error-messages/SoknadErrorMessages';

const SoknadRemoteDataFetcher = () => {
    const intl = useIntl();
    const soknadEssentials = useSoknadEssentials();

    return (
        <RemoteDataHandler<SoknadEssentials>
            remoteData={soknadEssentials}
            initializing={() => <LoadingPage />}
            loading={() => <LoadingPage />}
            error={() => (
                <ErrorPage
                    bannerTitle={intlHelper(intl, 'application.title')}
                    contentRenderer={() => <SoknadErrorMessages.GeneralApplicationError />}
                />
            )}
            success={([person, barn, mellomlagring]) => {
                return <Soknad søker={person} barn={barn} mellomlagring={mellomlagring} />;
            }}
        />
    );
};

export default SoknadRemoteDataFetcher;
