import React from 'react';
import { useIntl } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import { useFormikContext } from 'formik';
import LoadingPage from '../../common/pages/LoadingPage';
import { getSoknadRootRoute, SoknadApplicationType } from '../../common/soknad-common/stepConfigUtils';
import GlobalRoutes from '../config/routeConfig';
import KvitteringPage from '../pages/kvittering-page/KvitteringPage';
import { Person } from '../types/Person';
import { Barn, SoknadFormData } from '../types/SoknadFormData';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { mapFormDataToApiData } from '../utils/map-form-data-to-api-data/mapFormDataToApiData';
import DinSituasjonStep from './din-situasjon-step/DinSituasjonStep';
import DineBarnStep from './dine-barn-step/DineBarnStep';
import MottakerStep from './mottaker-step/MottakerStep';
import OmBarnaStep from './om-barna-step/OmBarnaStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { useSoknadContext } from './SoknadContext';
import { StepID } from './StepID';
import VelkommenPage from './velkommen-page/VelkommenPage';
import { isSuccess } from '@devexperts/remote-data-ts';

interface Props {
    barn?: Barn[];
    søker: Person;
}

const OVERFORING_APPLICATION_TYPE = SoknadApplicationType.MELDING;

const SoknadRoutes = ({ søker, barn = [] }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const availableSteps = getAvailableSteps(values, søker, barn);
    const {
        soknadStepsConfig,
        sendSoknadStatus,
    } = useSoknadContext();

    const renderSoknadStep = (barn: Barn[], søker: Person, stepID: StepID): React.ReactNode => {
        switch (stepID) {
            case StepID.DINE_BARN:
                return <DineBarnStep barn={barn} />;
            case StepID.OM_BARNA:
                return <OmBarnaStep barn={barn} />;
            case StepID.DIN_SITUASJON:
                return <DinSituasjonStep />;
            case StepID.MOTTAKER:
                return <MottakerStep søker={søker} />;
            case StepID.OPPSUMMERING:
                const apiValues = mapFormDataToApiData(intl.locale, values, barn);
                return <OppsummeringStep apiValues={apiValues} søker={søker} barn={barn} />;
        }
    };

    return (
        <Switch>
            <Route path={getSoknadRootRoute(OVERFORING_APPLICATION_TYPE)} exact={true}>
                <VelkommenPage />
            </Route>
            <Route path={GlobalRoutes.SOKNAD_SENT} exact={true}>
                {isSuccess(sendSoknadStatus.status) && <KvitteringPage />}
                {!isSuccess(sendSoknadStatus.status) && <LoadingPage />}
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
            <Route path="*">Unknown route or no valid steps</Route>
        </Switch>
    );
};
export default SoknadRoutes;
