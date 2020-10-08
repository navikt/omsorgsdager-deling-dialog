import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { failure, pending, success } from '@devexperts/remote-data-ts';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { SoknadApplicationType } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { ulid } from 'ulid';
import { sendSoknad } from '../api/sendSoknad';
import AppRoutes, { getRouteUrl } from '../config/routeConfig';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import { Person } from '../types/Person';
import { SoknadApiData } from '../types/SoknadApiData';
import { Barn, SoknadFormData } from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import {
    navigateTo,
    navigateToErrorPage,
    navigateToKvitteringPage,
    relocateToLoginPage,
    relocateToNavFrontpage,
    relocateToSoknad,
} from '../utils/navigationUtils';
import { initialSoknadFormData } from './initialSoknadValues';
import { initialSendSoknadState, SendSoknadStatus, SoknadContextProvider } from './SoknadContext';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import { soknadStepsConfig, StepID } from './soknadStepsConfig';
import soknadTempStorage, { isStorageDataValid } from './soknadTempStorage';

interface Props {
    søker: Person;
    barn: Barn[];
    soknadTempStorage: SoknadTempStorageData;
    route?: string;
}

const Soknad = ({ søker, barn, soknadTempStorage: tempStorage }: Props) => {
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
            if (location.pathname !== getRouteUrl(AppRoutes.SOKNAD)) {
                relocateToSoknad();
                setInitializing(false);
            } else {
                setInitializing(false);
            }
        } else {
            setInitializing(false);
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
            navigateTo(soknadStepUtils.getStepRoute(StepID.DINE_BARN, SoknadApplicationType.MELDING), history);
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
        navigateToKvitteringPage(history);
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
        if (isStorageDataValid(tempStorage, { søker, barn })) {
            setInitialFormData(tempStorage.formData);
            setSoknadId(tempStorage.metadata.soknadId);
            const currentRoute = history.location.pathname;
            const lastStepRoute = soknadStepUtils.getStepRoute(
                tempStorage.metadata.lastStepID,
                SoknadApplicationType.MELDING
            );
            if (currentRoute !== lastStepRoute) {
                setTimeout(() => {
                    navigateTo(
                        soknadStepUtils.getStepRoute(tempStorage.metadata.lastStepID, SoknadApplicationType.MELDING),
                        history
                    );
                    setInitializing(false);
                });
            } else {
                setInitializing(false);
            }
        } else {
            resetSoknad(history.location.pathname !== AppRoutes.SOKNAD);
        }
    }, [history, tempStorage, søker, barn]);

    return (
        <LoadWrapper
            isLoading={initializing}
            contentRenderer={() => {
                if (søker.myndig === false) {
                    return <IkkeMyndigPage />;
                }
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
                                <SoknadContextProvider
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
                                </SoknadContextProvider>
                            );
                        }}
                    />
                );
            }}
        />
    );
};

export default Soknad;
