import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Guide from '@navikt/sif-common-core/lib/components/guide/Guide';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import VeilederSVG from '@navikt/sif-common-core/lib/components/veileder-svg/VeilederSVG';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Person } from '../../types/Person';
import { SoknadApiData } from '../../types/SoknadApiData';
import { Barn, SoknadFormField } from '../../types/SoknadFormData';
import { validateBekrefterOpplysninger } from '../../validation/fieldValidation';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../StepID';
import DinSituasjonSummary from './DinSituasjonSummary';
import MottakerSummary from './MottakerSummary';
import OmBarnaSummary from './OmBarnaSummary';
import DineBarnSummary from './DineBarnSummary';
import SøkerSummary from './SøkerSummary';
import { useSoknadContext } from '../SoknadContext';

type Props = {
    søker: Person;
    barn: Barn[];
    apiValues?: SoknadApiData;
};

const OppsummeringStep = ({ søker, barn, apiValues }: Props) => {
    const intl = useIntl();
    const { sendSoknadStatus: sendStatus, onSendSoknad } = useSoknadContext();

    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            includeValidationSummary={false}
            showButtonSpinner={sendStatus.sendingInProgress}
            buttonDisabled={sendStatus.sendingInProgress}
            onSendSoknad={apiValues ? () => onSendSoknad(apiValues) : apiValues}
            // onValidSubmit={() => {
            //     if (apiValues) {
            //         // Allow formik to complete its process
            //         setTimeout(() => {
            //             setSendingInProgress(true);
            //             // Allow view to update
            //             setTimeout(() => {
            //                 triggerSend(apiValues);
            //             }, 0);
            //         });
            //     }
            // }}
        >
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
                                <DineBarnSummary apiValues={apiValues} barn={barn} />
                                <OmBarnaSummary apiValues={apiValues} />
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
            {sendStatus.showErrorMessage && sendStatus.sendingInProgress === false && (
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
