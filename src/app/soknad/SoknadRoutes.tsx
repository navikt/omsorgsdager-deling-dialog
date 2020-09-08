import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { History } from 'history';
import {
    getSoknadRootRoute,
    getSoknadStepRoute,
    getSoknadStepsConfig,
    SoknadApplicationType,
    SoknadStepsConfig,
} from '../../common/soknad-common/stepConfigUtils';
import { Person } from '../types/Person';
import StorageData from '../types/StorageData';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { navigateTo, navigateToSoknadFrontpage, relocateToReceiptPage } from '../utils/navigationUtils';
import DinSituasjonStep from './din-situasjon-step/DinSituasjonStep';
import DineBarnStep from './dine-barn-step/DineBarnStep';
import MottakerStep from './mottaker-step/MottakerStep';
import OmBarnaStep from './om-barna-step/OmBarnaStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { StepID } from './StepID';
import VelkommenPage from './velkommen-page/VelkommenPage';
import { Barn } from '../types/SoknadFormData';

interface Props {
    barn: Barn[];
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
    barn: Barn[],
    søker: Person,
    stepID: StepID,
    soknadStepsConfig: SoknadStepsConfig<StepID>,
    history: History
): React.ReactNode => {
    switch (stepID) {
        case StepID.DINE_BARN:
            return (
                <DineBarnStep
                    barn={barn}
                    soknadStepsConfig={soknadStepsConfig}
                    onValidSubmit={() => navigateToNextStepFromStep(StepID.DINE_BARN, soknadStepsConfig, history)}
                    onResetSoknad={() => navigateToSoknadFrontpage(history)}
                />
            );
        case StepID.OM_BARNA:
            return (
                <OmBarnaStep
                    barn={barn}
                    soknadStepsConfig={soknadStepsConfig}
                    onValidSubmit={() => navigateToNextStepFromStep(StepID.OM_BARNA, soknadStepsConfig, history)}
                    onResetSoknad={() => navigateToSoknadFrontpage(history)}
                />
            );
        case StepID.DIN_SITUASJON:
            return (
                <DinSituasjonStep
                    soknadStepsConfig={soknadStepsConfig}
                    onValidSubmit={() => navigateToNextStepFromStep(StepID.DIN_SITUASJON, soknadStepsConfig, history)}
                    onResetSoknad={() => navigateToSoknadFrontpage(history)}
                />
            );
        case StepID.MOTTAKER:
            return (
                <MottakerStep
                    søker={søker}
                    soknadStepsConfig={soknadStepsConfig}
                    onValidSubmit={() => navigateToNextStepFromStep(StepID.MOTTAKER, soknadStepsConfig, history)}
                    onResetSoknad={() => navigateToSoknadFrontpage(history)}
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
                    onResetSoknad={() => navigateToSoknadFrontpage(history)}
                />
            );
    }
};

const SoknadRoutes = ({ person, barn }: Props) => {
    const history = useHistory();

    const stepConfig = getSoknadStepsConfig(getAvailableSteps(), OVERFORING_APPLICATION_TYPE);
    const availableSteps = Object.keys(stepConfig) as Array<StepID>;

    if (!person.myndig) {
        return <div>Ikke myndig</div>;
    }

    return (
        <Switch>
            <Route path={getSoknadRootRoute(OVERFORING_APPLICATION_TYPE)} exact={true}>
                <VelkommenPage
                    onStartSoknad={() => {
                        navigateTo(getSoknadStepRoute(StepID.DINE_BARN, SoknadApplicationType.MELDING), history);
                    }}
                />
            </Route>
            {availableSteps.map((step) => {
                return (
                    <Route
                        key={step}
                        path={stepConfig[step].route}
                        exact={true}
                        render={() => renderSoknadStep(barn, person, step, stepConfig, history)}
                    />
                );
            })}
            <Route path="*">Unknown route</Route>
        </Switch>
    );
};
export default SoknadRoutes;
