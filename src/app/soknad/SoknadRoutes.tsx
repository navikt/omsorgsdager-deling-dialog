import React from 'react';
import { useIntl } from 'react-intl';
import { Redirect, Route, Switch } from 'react-router-dom';
import { isFailure, isInitial, isPending, isSuccess } from '@devexperts/remote-data-ts';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { useFormikContext } from 'formik';
import ErrorPage from '../../common/soknad-common-pages/ErrorPage';
import soknadStepUtils from '../../common/soknad-step/soknadStepUtils';
import AppRoutes from '../config/routeConfig';
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
import { SoknadApplicationType } from '../../common/soknad-step/soknadStepTypes';

interface Props {
    soknadId?: string;
    barn?: Barn[];
    søker: Person;
}

const OVERFORING_APPLICATION_TYPE = SoknadApplicationType.MELDING;

const SoknadRoutes = ({ soknadId, søker, barn = [] }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const availableSteps = getAvailableSteps(values, søker, barn);
    const { soknadStepsConfig, sendSoknadStatus } = useSoknadContext();

    const renderSoknadStep = (id: string, barn: Barn[], søker: Person, stepID: StepID): React.ReactNode => {
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
                const apiValues = mapFormDataToApiData(id, intl.locale, values, barn);
                return <OppsummeringStep apiValues={apiValues} søker={søker} barn={barn} />;
        }
    };

    return (
        <Switch>
            <Route path={soknadStepUtils.getRootRoute(OVERFORING_APPLICATION_TYPE)} exact={true}>
                <VelkommenPage />
            </Route>
            <Route path={AppRoutes.SOKNAD_SENT} exact={true}>
                <LoadWrapper
                    isLoading={isPending(sendSoknadStatus.status) || isInitial(sendSoknadStatus.status)}
                    contentRenderer={() => {
                        if (isSuccess(sendSoknadStatus.status) && <KvitteringPage />) {
                            return <KvitteringPage />;
                        }
                        if (isFailure(sendSoknadStatus.status)) {
                            return <ErrorPage />;
                        }
                        return <div>Det oppstod en feil</div>;
                    }}
                />
            </Route>
            {availableSteps.map((step) => {
                if (soknadId === undefined) {
                    return (
                        <Redirect
                            key="redirectToWelcome"
                            to={soknadStepUtils.getRootRoute(OVERFORING_APPLICATION_TYPE)}
                        />
                    );
                }
                return (
                    <Route
                        key={step}
                        path={soknadStepsConfig[step].route}
                        exact={true}
                        render={() => renderSoknadStep(soknadId, barn, søker, step)}
                    />
                );
            })}
            <Route path="*">Unknown route or no valid steps</Route>
        </Switch>
    );
};
export default SoknadRoutes;
