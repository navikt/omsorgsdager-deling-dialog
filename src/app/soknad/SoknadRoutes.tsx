import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { History } from 'history';
import {
    getSoknadRootRoute,
    getSoknadStepsConfig,
    SoknadApplicationType,
    SoknadStepsConfig,
} from '../../common/soknad-common/stepConfigUtils';
import { Person } from '../types/Person';
import StorageData from '../types/StorageData';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { navigateTo } from '../utils/navigationUtils';
import DinSituasjonStep from './din-situasjon-step/DinSituasjonStep';
import DineBarnStep from './dine-barn-step/DineBarnStep';
import MottakerStep from './mottaker-step/MottakerStep';
import OmBarnaStep from './om-barna-step/OmBarnaStep';
import OmsorgsdagerStep from './omsorgsdager-step/OmsorgsdagerStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { StepID } from './StepID';

interface Props {
    mellomlagring: StorageData;
    person: Person;
}

const OVERFORING_APPLICATION_TYPE = SoknadApplicationType.MELDING;

const navigateToNextStepFromStep = (stepID: StepID, allSteps: SoknadStepsConfig<StepID>, history: History) => {
    const step = allSteps[stepID];
    setTimeout(() => {
        if (step.nextStepRoute) {
            navigateTo(step.nextStepRoute, history);
        }
    });
};

const renderSoknadStep = (
    stepID: StepID,
    soknadStepsConfig: SoknadStepsConfig<StepID>,
    history: History
): React.ReactNode => {
    switch (stepID) {
        case StepID.DINE_BARN:
            return (
                <DineBarnStep
                    config={soknadStepsConfig}
                    onValidSubmit={() => navigateToNextStepFromStep(StepID.DINE_BARN, soknadStepsConfig, history)}
                    onResetSoknad={() => null}
                />
            );
        case StepID.OM_BARNA:
            return (
                <OmBarnaStep
                    config={soknadStepsConfig}
                    onValidSubmit={() => navigateToNextStepFromStep(StepID.OM_BARNA, soknadStepsConfig, history)}
                    onResetSoknad={() => null}
                />
            );
        case StepID.DIN_SITUASJON:
            return (
                <DinSituasjonStep
                    config={soknadStepsConfig}
                    onValidSubmit={() => navigateToNextStepFromStep(StepID.DIN_SITUASJON, soknadStepsConfig, history)}
                    onResetSoknad={() => null}
                />
            );
        case StepID.OMSORGSDAGER:
            return (
                <OmsorgsdagerStep
                    config={soknadStepsConfig}
                    onValidSubmit={() => navigateToNextStepFromStep(StepID.OMSORGSDAGER, soknadStepsConfig, history)}
                    onResetSoknad={() => null}
                />
            );
        case StepID.MOTTAKER:
            return (
                <MottakerStep
                    config={soknadStepsConfig}
                    onValidSubmit={() => navigateToNextStepFromStep(StepID.MOTTAKER, soknadStepsConfig, history)}
                    onResetSoknad={() => null}
                />
            );
        case StepID.OPPSUMMERING:
            return (
                <OppsummeringStep config={soknadStepsConfig} onValidSubmit={() => null} onResetSoknad={() => null} />
            );
    }
};

const SoknadRoutes = ({ person }: Props) => {
    const stepConfig = getSoknadStepsConfig(getAvailableSteps(), OVERFORING_APPLICATION_TYPE);
    const stepsToRender = Object.keys(stepConfig) as Array<StepID>;

    const history = useHistory();

    if (!person.myndig) {
        return <div>Ikke myndig</div>;
    }
    return (
        <Switch>
            <Route path={getSoknadRootRoute(OVERFORING_APPLICATION_TYPE)} exact={true}>
                Velkommen
            </Route>
            {stepsToRender.map((step) => {
                return (
                    <Route
                        key={step}
                        path={stepConfig[step].route}
                        exact={true}
                        render={() => renderSoknadStep(step, stepConfig, history)}
                    />
                );
            })}
            <Route path="*">Unknown route</Route>
        </Switch>
    );
};
export default SoknadRoutes;
