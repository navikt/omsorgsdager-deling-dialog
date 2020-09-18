import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { failure, pending, success } from '@devexperts/remote-data-ts';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import LoadingPage from '../../common/pages/LoadingPage';
import {
    getSoknadStepRoute,
    getSoknadStepsConfig,
    SoknadApplicationType,
} from '../../common/soknad-common/stepConfigUtils';
import { sendSoknad } from '../api/sendSoknad';
import GlobalRoutes, { getRouteUrl } from '../config/routeConfig';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import { Person } from '../types/Person';
import { SoknadApiData } from '../types/SoknadApiData';
import { Barn, SoknadFormData } from '../types/SoknadFormData';
import {
    navigateTo,
    navigateToErrorPage,
    navigateToReceiptPage,
    relocateToLoginPage,
    relocateToNavFrontpage,
    relocateToSoknad,
} from '../utils/navigationUtils';
import { initialSoknadFormData } from './initialSoknadValues';
import { initialSendSoknadState, SendSoknadStatus, SoknadContext } from './SoknadContext';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import soknadTempStorage, { isStorageDataValid, SoknadTemporaryStorageData } from './SoknadTempStorage';
import { SoknadSteps } from './stepConfigProps';
import { StepID } from './StepID';
import { ulid } from 'ulid';

interface Props {
    søker: Person;
    mellomlagring: SoknadTemporaryStorageData;
    barn: Barn[];
    route?: string;
}

const SoknadContent = ({ søker, barn, mellomlagring }: Props) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);

    const [initialFormData, setInitialFormData] = useState<Partial<SoknadFormData>>({ ...initialSoknadFormData });
    const [sendSoknadStatus, setSendSoknadStatus] = useState<SendSoknadStatus>(initialSendSoknadState);
    const [soknadId, setSoknadId] = useState<string | undefined>();

    const resetSoknad = async (redirectToFrontpage = true) => {
        await soknadTempStorage.purge();
        setInitialFormData({ ...initialSoknadFormData });
        setSoknadId(undefined);
        if (redirectToFrontpage) {
            if (location.pathname !== getRouteUrl(GlobalRoutes.SOKNAD)) {
                relocateToSoknad();
                setInitializing(false);
            } else {
                setInitializing(false);
            }
        }
    };

    const abortSoknad = async () => {
        await soknadTempStorage.purge();
        relocateToSoknad();
    };

    const startSoknad = async () => {
        await resetSoknad();
        const sId = ulid();
        setSoknadId(sId);
        await soknadTempStorage.persist(sId, initialFormData, StepID.DINE_BARN, { søker, barn });
        setTimeout(() => {
            navigateTo(getSoknadStepRoute(StepID.DINE_BARN, SoknadApplicationType.MELDING), history);
        });
    };

    const continueSoknadLater = async (sId: string, stepID: StepID, values: SoknadFormData) => {
        await soknadTempStorage.persist(sId, values, stepID, { søker, barn });
        relocateToNavFrontpage();
    };

    const onSoknadSent = async (apiValues: SoknadApiData) => {
        await soknadTempStorage.purge();
        setSendSoknadStatus({ failures: 0, status: success(apiValues) });
        setSoknadId(undefined);
        navigateToReceiptPage(history);
    };

    const send = async (apiValues: SoknadApiData) => {
        try {
            await sendSoknad(apiValues);
            onSoknadSent(apiValues);
        } catch (error) {
            if (isUserLoggedOut(error)) {
                relocateToLoginPage();
            } else {
                if (sendSoknadStatus.failures >= 2) {
                    navigateToErrorPage(history);
                } else {
                    setSendSoknadStatus({
                        failures: sendSoknadStatus.failures + 1,
                        status: failure(error),
                    });
                }
            }
        }
    };

    const triggerSend = (apiValues: SoknadApiData) => {
        setTimeout(() => {
            setSendSoknadStatus({ ...sendSoknadStatus, status: pending });
            setTimeout(() => {
                send(apiValues);
            });
        });
    };

    useEffect(() => {
        if (isStorageDataValid(mellomlagring, { søker, barn })) {
            setInitialFormData(mellomlagring.formData);
            setSoknadId(mellomlagring.metadata.soknadId);
            const currentRoute = history.location.pathname;
            const lastStepRoute = getSoknadStepRoute(mellomlagring.metadata.lastStepID, SoknadApplicationType.MELDING);
            if (currentRoute !== lastStepRoute) {
                setTimeout(() => {
                    navigateTo(
                        getSoknadStepRoute(mellomlagring.metadata.lastStepID, SoknadApplicationType.MELDING),
                        history
                    );
                    setInitializing(false);
                });
            } else {
                setInitializing(false);
            }
        } else {
            resetSoknad(true);
        }
    }, [history, mellomlagring, søker, barn]);

    if (initializing) {
        return <LoadingPage />;
    }

    if (søker.myndig === false) {
        return <IkkeMyndigPage />;
    }

    const soknadStepsConfig = getSoknadStepsConfig(SoknadSteps, SoknadApplicationType.MELDING);

    return (
        <SoknadFormComponents.FormikWrapper
            initialValues={initialFormData}
            onSubmit={() => null}
            renderForm={({ values }) => {
                const navigateToNextStepFromStep = (stepID: StepID) => {
                    const stepToPersist = soknadStepsConfig[stepID].nextStep;
                    if (stepToPersist && soknadId) {
                        soknadTempStorage.persist(soknadId, values, stepToPersist, { søker, barn });
                    }
                    const step = soknadStepsConfig[stepID];
                    setTimeout(() => {
                        if (step.nextStepRoute) {
                            navigateTo(step.nextStepRoute, history);
                        }
                    });
                };
                return (
                    <SoknadContext.Provider
                        value={{
                            soknadId,
                            soknadStepsConfig,
                            sendSoknadStatus,
                            resetSoknad: abortSoknad,
                            continueSoknadLater: soknadId
                                ? (stepId) => continueSoknadLater(soknadId, stepId, values)
                                : undefined,
                            startSoknad,
                            sendSoknad: triggerSend,
                            gotoNextStepFromStep: (stepID: StepID) => {
                                navigateToNextStepFromStep(stepID);
                            },
                        }}>
                        <SoknadRoutes soknadId={soknadId} søker={søker} barn={barn} />
                    </SoknadContext.Provider>
                );
            }}
        />
    );
};

export default SoknadContent;
