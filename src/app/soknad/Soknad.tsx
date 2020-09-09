import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Ingress } from 'nav-frontend-typografi';
import RemoteDataHandler from '../../common/application-setup/RemoteDataHandler';
import ErrorGuide from '../../common/error-guide/ErrorGuide';
import ErrorPage from '../../common/pages/ErrorPage';
import LoadingPage from '../../common/pages/LoadingPage';
import useSoknadEssentials, { CombinedType } from '../hooks/useSoknadEssentials';
import SoknadContent from './SoknadContent';

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
                    contentRenderer={() => (
                        <ErrorGuide title={intlHelper(intl, 'application.loadError.title')}>
                            <Ingress>
                                <FormattedMessage id="application.loadError.message" />
                            </Ingress>
                        </ErrorGuide>
                    )}
                />
            )}
            success={([person, barn, mellomlagring]) => {
                return <SoknadContent person={person} barn={barn} mellomlagring={mellomlagring} />;
            }}
        />
    );
};

export default Soknad;
