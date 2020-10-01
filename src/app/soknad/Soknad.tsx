import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import RemoteDataHandler from '../../common/application-setup/RemoteDataHandler';
import ErrorPage from '../../common/pages/ErrorPage';
import LoadingPage from '../../common/pages/LoadingPage';
import useSoknadEssentials, { CombinedType } from '../hooks/useSoknadEssentials';
import SoknadContent from './SoknadContent';
import SoknadErrorMessages from '../../common/soknad-error-messages/SoknadErrorMessages';

const Soknad = () => {
    const intl = useIntl();
    const soknadEssentials = useSoknadEssentials();

    return (
        <RemoteDataHandler<CombinedType>
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
                return <SoknadContent søker={person} barn={barn} mellomlagring={mellomlagring} />;
            }}
        />
    );
};

export default Soknad;
