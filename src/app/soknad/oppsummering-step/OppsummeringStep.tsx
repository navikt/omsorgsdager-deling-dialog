import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Guide from '@navikt/sif-common-core/lib/components/guide/Guide';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import VeilederSVG from '@navikt/sif-common-core/lib/components/veileder-svg/VeilederSVG';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { Person } from '../../types/Person';
import { SoknadApiData } from '../../types/SoknadApiData';
import { Arbeidssituasjon, Barn, Mottaker, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { mapFormDataToApiData } from '../../utils/map-form-data-to-api-data/mapFormDataToApiData';
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

const OppsummeringStep = ({ onResetSoknad, soknadStepsConfig, søker, barn = [] }: Props) => {
    const [sendingInProgress, setSendingInProgress] = useState(false);
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const apiValues = 1 === 1 + 1 ? mockApiValues : mapFormDataToApiData(intl.locale, values, barn);

    console.log(apiValues);

    const hasValidApiData = true;

    const triggerSend = (values: Partial<SoknadApiData>) => {
        console.log('sending', values);
    };

    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            soknadStepsConfig={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            includeValidationSummary={false}
            showButtonSpinner={sendingInProgress}
            buttonDisabled={sendingInProgress}
            onValidSubmit={() => {
                if (apiValues) {
                    setTimeout(() => {
                        setSendingInProgress(true);
                        setTimeout(() => {
                            // Wait to prevent double click send
                            triggerSend(apiValues);
                        });
                    });
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
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
