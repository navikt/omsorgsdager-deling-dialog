import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Ingress } from 'nav-frontend-typografi';
import RemoteDataHandler from '../../common/application-setup/RemoteDataHandler';
import ErrorGuide from '../../common/error-guide/ErrorGuide';
import ErrorPage from '../../common/pages/ErrorPage';
import LoadingPage from '../../common/pages/LoadingPage';
import useSoknadEssentials, { CombinedType } from '../hooks/useSoknadEssentials';
import { initialSoknadFormData } from '../types/SoknadFormData';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';

const Soknad = () => {
    const soknadEssentials = useSoknadEssentials();
    const intl = useIntl();
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
                return (
                    <SoknadFormComponents.FormikWrapper
                        initialValues={initialSoknadFormData}
                        onSubmit={() => null}
                        renderForm={() => {
                            return <SoknadRoutes person={person} barn={barn} mellomlagring={mellomlagring} />;
                        }}
                    />
                );
            }}
        />
    );
};

export default Soknad;
