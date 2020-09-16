import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingPage from '../../common/pages/LoadingPage';
import {
    getSoknadStepRoute,
    getSoknadStepsConfig,
    SoknadApplicationType,
} from '../../common/soknad-common/stepConfigUtils';
import { sendMelding } from '../api/sendMelding';
import GlobalRoutes, { getRouteUrl } from '../config/routeConfig';
import { Person } from '../types/Person';
import { SoknadApiData } from '../types/SoknadApiData';
import { Barn, initialSoknadFormData, SoknadFormData } from '../types/SoknadFormData';
import {
    navigateTo,
    navigateToErrorPage,
    navigateToReceiptPage,
    relocateToLoginPage,
    relocateToNavFrontpage,
    relocateToSoknad,
} from '../utils/navigationUtils';
import { SoknadContext, SendSoknadStatus } from './SoknadContext';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import soknadTempStorage, { isStorageDataValid, SoknadTemporaryStorageData } from './SoknadTempStorage';
import { SoknadSteps } from './stepConfigProps';
import { StepID } from './StepID';

interface Props {
    søker: Person;
    mellomlagring: SoknadTemporaryStorageData;
    barn: Barn[];
    route?: string;
}

// async function send(data: SoknadApiData) {
//         const sendCounter = sendStatus.sendCounter + 1;
//         try {
//             setSendSoknadStatus({ sendCounter, showErrorMessage: false });
//             await sendMelding(data);
//             onMeldingSent(data);
//         } catch (error) {
//             if (isUserLoggedOut(error)) {
//                 relocateToLoginPage();
//             } else {
//                 if (sendCounter === 3) {
//                     navigateToErrorPage(history);
//                 } else {
//                     setSendSoknadStatus({
//                         sendCounter,
//                         showErrorMessage: true,
//                     });
//                     setSendingInProgress(false);
//                 }
//             }
//         }
//     }

const SoknadContent = ({ søker, barn, mellomlagring }: Props) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);

    const [initialFormData, setInitialFormData] = useState<Partial<SoknadFormData>>({ ...initialSoknadFormData });
    const [sendSoknadStatus, setSendSoknadStatus] = useState<SendSoknadStatus>({
        sendCounter: 0,
        sendingInProgress: false,
        showErrorMessage: false,
    });

    const resetSoknad = async (redirectToFrontpage = true) => {
        await soknadTempStorage.purge();
        setInitialFormData({ ...initialSoknadFormData });
        if (redirectToFrontpage) {
            if (location.pathname !== getRouteUrl(GlobalRoutes.MELDING)) {
                relocateToSoknad();
                setInitializing(false);
            } else {
                setInitializing(false);
            }
        }
    };

    const startSoknad = async () => {
        await resetSoknad();
        setTimeout(() => {
            navigateTo(getSoknadStepRoute(StepID.DINE_BARN, SoknadApplicationType.MELDING), history);
        });
    };

    const continueLater = async (stepID: StepID, values: SoknadFormData) => {
        await soknadTempStorage.persist(values, stepID, { søker, barn });
        relocateToNavFrontpage();
    };

    const onSoknadSent = async () => {
        // await soknadTempStorage.purge();
        setSendSoknadStatus({ sendCounter: 0, soknadSent: true, sendingInProgress: false, showErrorMessage: false });
        navigateToReceiptPage(history);
    };

    const sendSoknad = async (apiValues: SoknadApiData) => {
        const sendCounter = sendSoknadStatus.sendCounter + 1;
        try {
            setSendSoknadStatus({ sendingInProgress: true, soknadSent: false, sendCounter, showErrorMessage: false });
            await sendMelding(apiValues);
            onSoknadSent();
        } catch (error) {
            if (isUserLoggedOut(error)) {
                relocateToLoginPage();
            } else {
                if (sendCounter === 3) {
                    navigateToErrorPage(history);
                } else {
                    setSendSoknadStatus({
                        sendingInProgress: false,
                        soknadSent: false,
                        sendCounter,
                        showErrorMessage: true,
                    });
                }
            }
        }
    };

    const startSendSoknad = (apiValues: SoknadApiData) => {
        setTimeout(() => {
            setSendSoknadStatus({ ...sendSoknadStatus, soknadSent: false, sendingInProgress: true });
            setTimeout(() => {
                sendSoknad(apiValues);
            });
        });
    };

    useEffect(() => {
        if (isStorageDataValid(mellomlagring, { søker, barn })) {
            setInitialFormData(mellomlagring.formData);
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
        return <div>Ikke myndig</div>;
    }

    const soknadStepsConfig = getSoknadStepsConfig(SoknadSteps, SoknadApplicationType.MELDING);

    return (
        <SoknadFormComponents.FormikWrapper
            initialValues={initialFormData}
            onSubmit={() => null}
            renderForm={({ values }) => {
                const navigateToNextStepFromStep = (stepID: StepID) => {
                    const stepToPersist = soknadStepsConfig[stepID].nextStep;
                    if (stepToPersist) {
                        soknadTempStorage.persist(values, stepToPersist, { søker, barn });
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
                            soknadStepsConfig,
                            sendSoknadStatus,
                            onResetSoknad: resetSoknad,
                            onContinueLater: (stepId) => continueLater(stepId, values),
                            onStartSoknad: startSoknad,
                            onSendSoknad: startSendSoknad,
                            onSoknadSent: onSoknadSent,
                            onContinue: (stepID: StepID) => {
                                navigateToNextStepFromStep(stepID);
                            },
                        }}>
                        <SoknadRoutes søker={søker} barn={barn} />
                    </SoknadContext.Provider>
                );
            }}
        />
    );
};

export default SoknadContent;
