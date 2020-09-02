import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
    getSoknadRootRoute,
    getSoknadStepsConfig,
    SoknadApplicationType,
    SoknadStepsConfig,
} from '../../common/soknad-common/soknadStepConfig';
import { Person } from '../types/Person';
import StorageData from '../types/StorageData';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import DineBarnStep from './dine-barn-step/DineBarnStep';
import MottakerStep from './mottaker-step/MottakerStep';
import OmBarnaStep from './om-barna-step/OmBarnaStep';
import OmsorgsdagerStep from './omsorgsdager-step/OmsorgsdagerStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { SoknadStepID } from './SoknadStepIDs';

interface Props {
    mellomlagring: StorageData;
    person: Person;
}

const renderSoknadStep = (
    stepID: SoknadStepID,
    soknadStepsConfig: SoknadStepsConfig<SoknadStepID>
): React.ReactNode => {
    switch (stepID) {
        case SoknadStepID.DINE_BARN:
            return (
                <DineBarnStep
                    stepId={SoknadStepID.DINE_BARN}
                    soknadStepsConfig={soknadStepsConfig}
                    onValidSubmit={() => null}
                    onResetSoknad={() => null}
                />
            );
        case SoknadStepID.OM_BARNA:
            return (
                <OmBarnaStep
                    stepId={SoknadStepID.OM_BARNA}
                    soknadStepsConfig={soknadStepsConfig}
                    onValidSubmit={() => null}
                    onResetSoknad={() => null}
                />
            );
        case SoknadStepID.ARBEIDSSITUASJON:
            return (
                <ArbeidssituasjonStep
                    stepId={SoknadStepID.ARBEIDSSITUASJON}
                    soknadStepsConfig={soknadStepsConfig}
                    onValidSubmit={() => null}
                    onResetSoknad={() => null}
                />
            );
        case SoknadStepID.OMSORGSDAGER:
            return (
                <OmsorgsdagerStep
                    stepId={SoknadStepID.OMSORGSDAGER}
                    soknadStepsConfig={soknadStepsConfig}
                    onValidSubmit={() => null}
                    onResetSoknad={() => null}
                />
            );
        case SoknadStepID.MOTTAKER:
            return (
                <MottakerStep
                    stepId={SoknadStepID.MOTTAKER}
                    soknadStepsConfig={soknadStepsConfig}
                    onValidSubmit={() => null}
                    onResetSoknad={() => null}
                />
            );
        case SoknadStepID.OPPSUMMERING:
            return (
                <OppsummeringStep
                    stepId={SoknadStepID.OPPSUMMERING}
                    soknadStepsConfig={soknadStepsConfig}
                    onValidSubmit={() => null}
                    onResetSoknad={() => null}
                />
            );
    }
};

const SoknadRoutes = ({ person }: Props) => {
    if (!person.myndig) {
        return <div>Ikke myndig</div>;
    }
    const stepConfig = getSoknadStepsConfig(getAvailableSteps(), SoknadApplicationType.MELDING);
    const stepsToRender = Object.keys(stepConfig) as Array<SoknadStepID>;
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
