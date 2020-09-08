import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Ingress } from 'nav-frontend-typografi';
import RemoteDataHandler from '../../common/application-setup/RemoteDataHandler';
import ErrorGuide from '../../common/error-guide/ErrorGuide';
import ErrorPage from '../../common/pages/ErrorPage';
import LoadingPage from '../../common/pages/LoadingPage';
import GlobalRoutes, { getRouteUrl } from '../config/routeConfig';
import useSoknadEssentials, { CombinedType } from '../hooks/useSoknadEssentials';
import { initialSoknadFormData, SoknadFormData } from '../types/SoknadFormData';
import { relocateToNavFrontpage, relocateToSoknad } from '../utils/navigationUtils';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import soknadTempStorage from './SoknadTempStorage';
import { StepID } from './StepID';

const Soknad = () => {
    const intl = useIntl();
    const soknadEssentials = useSoknadEssentials();

    async function resetSoknad(redirectToFrontpage = true) {
        await soknadTempStorage.purge();
        if (redirectToFrontpage) {
            if (location.pathname !== getRouteUrl(GlobalRoutes.MELDING)) {
                relocateToSoknad();
            }
        }
    }

    const continueLater = (stepID: StepID, values: SoknadFormData) => {
        soknadTempStorage.persist(values, stepID);
        relocateToNavFrontpage();
    };

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
                if (mellomlagring) {
                    console.log(mellomlagring);
                }
                return (
                    <SoknadFormComponents.FormikWrapper
                        initialValues={initialSoknadFormData}
                        onSubmit={() => null}
                        renderForm={({ values }) => {
                            return (
                                <SoknadRoutes
                                    person={person}
                                    barn={barn}
                                    onResetSoknad={resetSoknad}
                                    onContinueLater={(stepId) => continueLater(stepId, values)}
                                />
                            );
                        }}
                    />
                );
            }}
        />
    );
};

export default Soknad;
