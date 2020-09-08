import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Guide from '@navikt/sif-common-core/lib/components/guide/Guide';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import VeilederSVG from '@navikt/sif-common-core/lib/components/veileder-svg/VeilederSVG';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { sendMelding } from '../../api/sendMelding';
import { Person } from '../../types/Person';
import { SoknadApiData } from '../../types/SoknadApiData';
import { Arbeidssituasjon, Barn, Mottaker, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { mapFormDataToApiData } from '../../utils/map-form-data-to-api-data/mapFormDataToApiData';
import { navigateToErrorPage, relocateToLoginPage } from '../../utils/navigationUtils';
import { validateBekrefterOpplysninger } from '../../validation/fieldValidation';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';
import DinSituasjonSummary from './DinSituasjonSummary';
import MottakerSummary from './MottakerSummary';
import SøkerSummary from './SøkerSummary';

type Props = StepConfigProps & {
    søker: Person;
    barn?: Barn[];
    onMeldingSent: (apiValues: SoknadApiData) => void;
};

const mockApiValues: SoknadApiData = {
    antallDagerHarDeltMedAndre: 2,
    antallDagerSomSkalOverføres: 10,
    antallDagerBruktEtter1Juli: 3,
    arbeiderINorge: true,
    arbeidssituasjon: [Arbeidssituasjon.arbeidstaker],
    borINorge: true,
    harAleneomsorg: true,
    harAleneomsorgFor: [],
    harBekreftetMottakerOpplysninger: true,
    harBekreftetOpplysninger: true,
    harDeltDagerMedAndreTidligere: false,
    harForståttRettigheterOgPlikter: true,
    harUtvidetRett: false,
    harUtvidetRettFor: [],
    mottakerFnr: '12101020000',
    mottakerNavn: 'Snurre Sprett',
    mottakerType: Mottaker.samboer,
    språk: 'nb',
    andreBarn: [],
};

interface SendSoknadStatus {
    sendCounter: number;
    showErrorMessage: boolean;
}

const OppsummeringStep = ({ søker, onMeldingSent, ...restProps }: Props) => {
    const intl = useIntl();
    const history = useHistory();
    const [sendStatus, setSendSoknadStatus] = useState<SendSoknadStatus>({
        sendCounter: 0,
        showErrorMessage: false,
    });
    const [sendingInProgress, setSendingInProgress] = useState(false);

    const { values } = useFormikContext<SoknadFormData>();
    const apiValues = 1 === 1 + 1 ? mockApiValues : mapFormDataToApiData(intl.locale, values);
    const hasValidApiData = true;

    async function send(data: SoknadApiData) {
        const sendCounter = sendStatus.sendCounter + 1;
        try {
            setSendSoknadStatus({ sendCounter, showErrorMessage: false });
            await sendMelding(data);
            onMeldingSent(data);
        } catch (error) {
            if (isUserLoggedOut(error)) {
                relocateToLoginPage();
            } else {
                if (sendCounter === 3) {
                    navigateToErrorPage(history);
                } else {
                    setSendSoknadStatus({
                        sendCounter,
                        showErrorMessage: true,
                    });
                    setSendingInProgress(false);
                }
            }
        }
    }

    const triggerSend = debounce(send, 250); // Prevent double

    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            {...restProps}
            includeValidationSummary={false}
            showButtonSpinner={sendingInProgress}
            buttonDisabled={sendingInProgress}
            onValidSubmit={() => {
                if (apiValues) {
                    setSendingInProgress(true);
                    setTimeout(() => {
                        triggerSend(apiValues);
                    }, 0);
                }
            }}
            showSubmitButton={hasValidApiData}>
            <Box margin="xxxl">
                <Guide kompakt={true} type="normal" svg={<VeilederSVG />}>
                    Info
                </Guide>
                {apiValues === undefined && <div>Api verdier mangler</div>}
                {apiValues !== undefined && (
                    <>
                        <Box margin="xxl">
                            <ResponsivePanel border={true}>
                                <SøkerSummary søker={søker} />
                                <DinSituasjonSummary apiValues={apiValues} />
                                <MottakerSummary apiValues={apiValues} />
                            </ResponsivePanel>
                        </Box>

                        <Box margin="l">
                            <SoknadFormComponents.ConfirmationCheckbox
                                label={intlHelper(intl, 'step.oppsummering.bekrefterOpplysninger')}
                                name={SoknadFormField.harBekreftetOpplysninger}
                                validate={validateBekrefterOpplysninger}
                            />
                        </Box>
                    </>
                )}
            </Box>
            {sendStatus.showErrorMessage && sendingInProgress === false && (
                <FormBlock>
                    {sendStatus.sendCounter === 1 && (
                        <AlertStripeFeil>
                            <FormattedMessage id="step.oppsummering.sendMelding.feilmelding.førsteGang" />
                        </AlertStripeFeil>
                    )}
                    {sendStatus.sendCounter === 2 && (
                        <AlertStripeFeil>
                            <FormattedMessage id="step.oppsummering.sendMelding.feilmelding.andreGang" />
                        </AlertStripeFeil>
                    )}
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
