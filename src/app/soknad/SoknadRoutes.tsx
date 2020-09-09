import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import {
    getSoknadRootRoute,
    getSoknadStepsConfig,
    SoknadApplicationType,
} from '../../common/soknad-common/stepConfigUtils';
import { Person } from '../types/Person';
import { Barn, SoknadFormData } from '../types/SoknadFormData';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { navigateTo, relocateToReceiptPage } from '../utils/navigationUtils';
import DinSituasjonStep from './din-situasjon-step/DinSituasjonStep';
import DineBarnStep from './dine-barn-step/DineBarnStep';
import MottakerStep from './mottaker-step/MottakerStep';
import OmBarnaStep from './om-barna-step/OmBarnaStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import soknadTempStorage from './SoknadTempStorage';
import { StepID } from './StepID';
import VelkommenPage from './velkommen-page/VelkommenPage';

interface Props {
    barn: Barn[];
    søker: Person;
    onStartSoknad: () => void;
    onResetSoknad: () => void;
    onContinueLater?: (stepID: StepID) => void;
}

const OVERFORING_APPLICATION_TYPE = SoknadApplicationType.MELDING;

const SoknadRoutes = ({ søker, barn, onStartSoknad, onResetSoknad, onContinueLater }: Props) => {
    const history = useHistory();
    const { values } = useFormikContext<SoknadFormData>();
    const soknadStepsConfig = getSoknadStepsConfig(getAvailableSteps(), OVERFORING_APPLICATION_TYPE);
    const availableSteps = Object.keys(soknadStepsConfig) as Array<StepID>;

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

    const renderSoknadStep = (barn: Barn[], søker: Person, stepID: StepID): React.ReactNode => {
        switch (stepID) {
            case StepID.DINE_BARN:
                return (
                    <DineBarnStep
                        barn={barn}
                        soknadStepsConfig={soknadStepsConfig}
                        onValidSubmit={() => navigateToNextStepFromStep(StepID.DINE_BARN)}
                        onResetSoknad={onResetSoknad}
                        onContinueLater={onContinueLater}
                    />
                );
            case StepID.OM_BARNA:
                return (
                    <OmBarnaStep
                        barn={barn}
                        soknadStepsConfig={soknadStepsConfig}
                        onValidSubmit={() => navigateToNextStepFromStep(StepID.OM_BARNA)}
                        onResetSoknad={onResetSoknad}
                        onContinueLater={onContinueLater}
                    />
                );
            case StepID.DIN_SITUASJON:
                return (
                    <DinSituasjonStep
                        soknadStepsConfig={soknadStepsConfig}
                        onValidSubmit={() => navigateToNextStepFromStep(StepID.DIN_SITUASJON)}
                        onResetSoknad={onResetSoknad}
                        onContinueLater={onContinueLater}
                    />
                );
            case StepID.MOTTAKER:
                return (
                    <MottakerStep
                        søker={søker}
                        soknadStepsConfig={soknadStepsConfig}
                        onValidSubmit={() => navigateToNextStepFromStep(StepID.MOTTAKER)}
                        onResetSoknad={onResetSoknad}
                        onContinueLater={onContinueLater}
                    />
                );
            case StepID.OPPSUMMERING:
                return (
                    <OppsummeringStep
                        onMeldingSent={() => relocateToReceiptPage()}
                        søker={søker}
                        barn={barn}
                        soknadStepsConfig={soknadStepsConfig}
                        onValidSubmit={() => null}
                        onResetSoknad={onResetSoknad}
                        onContinueLater={onContinueLater}
                    />
                );
        }
    };

    return (
        <Switch>
            <Route path={getSoknadRootRoute(OVERFORING_APPLICATION_TYPE)} exact={true}>
                <VelkommenPage onStartSoknad={onStartSoknad} />
            </Route>
            {availableSteps.map((step) => {
                return (
                    <Route
                        key={step}
                        path={soknadStepsConfig[step].route}
                        exact={true}
                        render={() => renderSoknadStep(barn, søker, step)}
                    />
                );
            })}
            <Route path="*">Unknown route</Route>
        </Switch>
    );
};
export default SoknadRoutes;
