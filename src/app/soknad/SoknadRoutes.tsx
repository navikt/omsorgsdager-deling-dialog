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
import { getAvailableSteps } from '../utils/getAvailableSteps';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import DineBarnStep from './dine-barn-step/DineBarnStep';
import MedlemskapStep from './medlemskap-step/MedlemskapStep';
import MottakerStep from './mottaker-step/MottakerStep';
import OmBarnaStep from './om-barna-step/OmBarnaStep';
import OmsorgsdagerStep from './omsorgsdager-step/OmsorgsdagerStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { SoknadStep } from './SoknadSteps';

interface Props {
    mellomlagring: StorageData;
    person: Person;
}

const renderSoknadStep = (stepID: SoknadStep, soknadStepsConfig: SoknadStepsConfig<SoknadStep>): React.ReactNode => {
    switch (stepID) {
        case SoknadStep.DINE_BARN:
            return (
                <DineBarnStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case SoknadStep.OM_BARNA:
            return (
                <OmBarnaStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case SoknadStep.ARBEIDSSITUASJON:
            return (
                <ArbeidssituasjonStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case SoknadStep.OMSORGSDAGER:
            return (
                <OmsorgsdagerStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case SoknadStep.MOTTAKER:
            return (
                <MottakerStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case SoknadStep.MEDLEMSKAP:
            return (
                <MedlemskapStep
                    stepConfig={soknadStepsConfig[stepID]}
                    onValidSubmit={() => null}
                    resetSoknad={() => null}
                />
            );
        case SoknadStep.OPPSUMMERING:
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
    const stepsToRender = Object.keys(stepConfig) as Array<SoknadStep>;
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
