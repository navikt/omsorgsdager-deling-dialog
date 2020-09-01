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
import { getAvailableSteps, StepID } from './stepConfig';
import DineBarnStep from './dine-barn-step/DineBarnStep';
import OmBarnaStep from './om-barna-step/OmBarnaStep';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import OmsorgsdagerStep from './omsorgsdager-step/OmsorgsdagerStep';
import MottakerStep from './mottaker-step/MottakerStep';
import MedlemskapStep from './medlemskap-step/MedlemskapStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';

interface Props {
    mellomlagring: StorageData;
    person: Person;
}

const renderSoknadStep = (stepID: StepID, soknadStepsConfig: SoknadStepsConfig<StepID>): React.ReactNode => {
    switch (stepID) {
        case StepID.DINE_BARN:
            return <DineBarnStep stepConfig={soknadStepsConfig[stepID]} />;
        case StepID.OM_BARNA:
            return <OmBarnaStep stepConfig={soknadStepsConfig[stepID]} />;
        case StepID.ARBEIDSSITUASJON:
            return <ArbeidssituasjonStep stepConfig={soknadStepsConfig[stepID]} />;
        case StepID.OMSORGSDAGER:
            return <OmsorgsdagerStep stepConfig={soknadStepsConfig[stepID]} />;
        case StepID.MOTTAKER:
            return <MottakerStep stepConfig={soknadStepsConfig[stepID]} />;
        case StepID.MEDLEMSKAP:
            return <MedlemskapStep stepConfig={soknadStepsConfig[stepID]} />;
        case StepID.OPPSUMMERING:
            return <OppsummeringStep stepConfig={soknadStepsConfig[stepID]} />;
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
