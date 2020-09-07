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
import { SoknadFormData, SoknadFormField, Barn } from '../../types/SoknadFormData';
import { mapFormDataToApiData } from '../../utils/map-form-data-to-api-data/mapFormDataToApiData';
import { validateBekrefterOpplysninger } from '../../validation/fieldValidation';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';
import { Undertittel } from 'nav-frontend-typografi';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import SpacedCharString from '../../../common/spaced-char-string/SpacedCharString';

type Props = StepConfigProps & {
    søker: Person;
    barn?: Barn[];
};

const OppsummeringStep = ({ onResetSoknad, soknadStepsConfig, søker, barn }: Props) => {
    const [sendingInProgress, setSendingInProgress] = useState(false);
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const apiValues = mapFormDataToApiData(intl.locale, values);
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

                <Box margin="xxl">
                    <ResponsivePanel border={true}>
                        <Undertittel className="sectionTitle">Søker</Undertittel>
                        <Box margin="l">
                            <strong>{formatName(søker.fornavn, søker.etternavn, søker.mellomnavn)}</strong>
                            <div>
                                Fødselsnummer: <SpacedCharString str={søker.fødselsnummer} />
                            </div>
                        </Box>
                    </ResponsivePanel>
                </Box>

                <Box margin="l">
                    <SoknadFormComponents.ConfirmationCheckbox
                        label={intlHelper(intl, 'step.oppsummering.bekrefterOpplysninger')}
                        name={SoknadFormField.harBekreftetOpplysninger}
                        validate={validateBekrefterOpplysninger}
                    />
                </Box>
            </Box>
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
