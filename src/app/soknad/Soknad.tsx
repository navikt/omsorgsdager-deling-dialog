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
import { useAmplitudeInstance } from '../sif-amplitude/amplitude';
import { Person } from '../types/Person';
import { SoknadApiData } from '../types/SoknadApiData';
import { Barn, SoknadFormData } from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import appSentryLogger from '../utils/appSentryLogger';
import {
    navigateTo,
    navigateToErrorPage,
    navigateToKvitteringPage,
    relocateToLoginPage,
    relocateToNavFrontpage,
    relocateToSoknad,
} from '../utils/navigationUtils';
import { verifySoknadApiData } from '../validation/verifySoknadApiData';
import { initialSoknadFormData } from './initialSoknadValues';
import { initialSendSoknadState, SendSoknadStatus, SoknadContextProvider } from './SoknadContext';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import { getSoknadStepsConfig, StepID } from './soknadStepsConfig';
import soknadTempStorage, { isStorageDataValid } from './soknadTempStorage';

interface Props {
    søker: Person;
    barn: Barn[];
    soknadTempStorage: SoknadTempStorageData;
    route?: string;
}

type resetFormFunc = () => void;

const Soknad = ({ søker, barn, soknadTempStorage: tempStorage }: Props) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);

    const [initialFormData, setInitialFormData] = useState<Partial<SoknadFormData>>({ ...initialSoknadFormData });
    const [sendSoknadStatus, setSendSoknadStatus] = useState<SendSoknadStatus>(initialSendSoknadState);
    const [soknadId, setSoknadId] = useState<string | undefined>();

    const { logSoknadSent, logSoknadFailed } = useAmplitudeInstance();

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
        const firstStep = StepID.MOTTAKER;
        await soknadTempStorage.persist(sId, { ...initialFormData, harForståttRettigheterOgPlikter: true }, firstStep, {
            søker,
            barn,
        });
        setTimeout(() => {
            navigateTo(soknadStepUtils.getStepRoute(firstStep, SoknadApplicationType.MELDING), history);
        });
    };

    const continueSoknadLater = async (sId: string, stepID: StepID, values: SoknadFormData) => {
        await soknadTempStorage.persist(sId, values, stepID, { søker, barn });
        relocateToNavFrontpage();
    };

    const doSendSoknad = async (apiValues: SoknadApiData, resetFormikForm: resetFormFunc) => {
        try {
            await sendSoknad(apiValues);
            await soknadTempStorage.purge();
            await logSoknadSent(apiValues.type);
            setSendSoknadStatus({ failures: 0, status: success(apiValues) });
            navigateToKvitteringPage(history);
            setSoknadId(undefined);
            resetFormikForm();
        } catch (error) {
            if (isUserLoggedOut(error)) {
                relocateToLoginPage();
            } else {
                await logSoknadFailed(apiValues.type);
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

    const triggerSend = async (apiValues: SoknadApiData, resetForm: resetFormFunc) => {
        const apiDataIsValid = verifySoknadApiData(apiValues);
        if (apiDataIsValid) {
            setTimeout(() => {
                setSendSoknadStatus({ ...sendSoknadStatus, status: pending });
                setTimeout(() => {
                    doSendSoknad(apiValues, resetForm);
                });
            });
        } else {
            await appSentryLogger.logError('ApiVerificationFailed');
            navigateToErrorPage(history);
        }
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
                        renderForm={({ values, resetForm }) => {
                            const soknadStepsConfig = getSoknadStepsConfig(values);
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
                                        sendSoknad: (values) => triggerSend(values, resetForm),
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
