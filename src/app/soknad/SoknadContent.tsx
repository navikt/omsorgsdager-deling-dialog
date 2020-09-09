import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingPage from '../../common/pages/LoadingPage';
import { getSoknadStepRoute, SoknadApplicationType } from '../../common/soknad-common/stepConfigUtils';
import GlobalRoutes, { getRouteUrl } from '../config/routeConfig';
import { Person } from '../types/Person';
import { Barn, initialSoknadFormData, SoknadFormData } from '../types/SoknadFormData';
import { navigateTo, relocateToNavFrontpage, relocateToSoknad } from '../utils/navigationUtils';
import SoknadFormComponents from './SoknadFormComponents';
import SoknadRoutes from './SoknadRoutes';
import soknadTempStorage, { isStorageDataValid, SoknadTemporaryStorageData } from './SoknadTempStorage';
import { StepID } from './StepID';

interface Props {
    søker: Person;
    mellomlagring: SoknadTemporaryStorageData;
    barn: Barn[];
    route?: string;
}

const SoknadContent = ({ søker, barn, mellomlagring }: Props) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);

    const [initialFormData, setInitialFormData] = useState<Partial<SoknadFormData>>({ ...initialSoknadFormData });

    const resetSoknad = async (redirectToFrontpage = true) => {
        await soknadTempStorage.purge();
        setInitialFormData({ ...initialSoknadFormData });
        if (redirectToFrontpage && location.pathname !== getRouteUrl(GlobalRoutes.MELDING)) {
            relocateToSoknad();
            setInitializing(false);
        } else {
            setInitializing(false);
        }
    };

    const continueLater = async (stepID: StepID, values: SoknadFormData) => {
        await soknadTempStorage.persist(values, stepID, { søker, barn });
        relocateToNavFrontpage();
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

    return (
        <SoknadFormComponents.FormikWrapper
            initialValues={initialFormData}
            onSubmit={() => null}
            renderForm={({ values }) => {
                return (
                    <SoknadRoutes
                        søker={søker}
                        barn={barn}
                        onResetSoknad={resetSoknad}
                        onContinueLater={(stepId) => continueLater(stepId, values)}
                    />
                );
            }}
        />
    );
};

export default SoknadContent;
