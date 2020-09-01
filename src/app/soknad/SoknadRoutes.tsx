import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
    getSoknadRootRoute,
    getSoknadStepsConfig,
    SoknadApplicationType,
    SoknadStepsConfig,
} from '../../common/soknad/soknadStepConfig';
import { Person } from '../types/Person';
import StorageData from '../types/StorageData';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import DineBarnStep from './dine-barn-step/DineBarnStep';
import MedlemskapStep from './medlemskap-step/MedlemskapStep';
import MottakerStep from './mottaker-step/MottakerStep';
import OmBarnaStep from './om-barna-step/OmBarnaStep';
import OmsorgsdagerStep from './omsorgsdager-step/OmsorgsdagerStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { getAvailableSteps, StepID } from './stepConfig';

interface Props {
    mellomlagring: StorageData;
    person: Person;
}

const renderSoknadStep = (stepID: StepID, soknadStepsConfig: SoknadStepsConfig<StepID>): React.ReactNode => {
    switch (stepID) {
        case StepID.DINE_BARN:
            return (
                <DineBarnStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case StepID.OM_BARNA:
            return (
                <OmBarnaStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case StepID.ARBEIDSSITUASJON:
            return (
                <ArbeidssituasjonStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case StepID.OMSORGSDAGER:
            return (
                <OmsorgsdagerStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case StepID.MOTTAKER:
            return (
                <MottakerStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case StepID.MEDLEMSKAP:
            return (
                <MedlemskapStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case StepID.OPPSUMMERING:
            return (
                <OppsummeringStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
    }
};

const SoknadRoutes = ({ person }: Props) => {
    if (person.myndig) {
        return <div>Ikke myndig</div>;
    }
    const stepConfig = getSoknadStepsConfig(getAvailableSteps(), SoknadApplicationType.MELDING);
    const stepsToRender = Object.keys(stepConfig) as Array<StepID>;
    return (
        <Switch>
            <Route path={getSoknadRootRoute(SoknadApplicationType.MELDING)} exact={true}>
                Velkommen
            </Route>
            {stepsToRender.map((step) => {
                return (
                    <Route
                        key={step}
                        path={stepConfig[step].route}
                        exact={true}
                        render={() => renderSoknadStep(step, stepConfig)}
                    />
                );
            })}
            <Route path="*">Unknown route</Route>
        </Switch>
    );
};
export default SoknadRoutes;
