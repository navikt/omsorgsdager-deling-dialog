import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';
import SoknadFormComponents from '../SoknadFormComponents';
import { SoknadFormField, SoknadFormData } from '../../types/SoknadFormData';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    validateYesOrNoIsAnswered,
    validateRequiredList,
    validateRequiredNumber,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { getArbeidssituasjonOptions } from '../shared/shared-form-elements';
import { useFormikContext } from 'formik';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';

const cleanupDinSituasjonStep = (values: SoknadFormData): SoknadFormData => {
    const cleanedValues = { ...values };
    if (values.harBruktOmsorgsdagerEtter1Juli === YesOrNo.NO) {
        cleanedValues.antallDagerBruktEtter1Juli = undefined;
    }
    return cleanedValues;
};

const DinSituasjon = ({ onResetSoknad, onValidSubmit, config: soknadStepsConfig }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const { harBruktOmsorgsdagerEtter1Juli } = values;

    return (
        <SoknadFormStep
            id={StepID.DIN_SITUASJON}
            config={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}
            onStepCleanup={cleanupDinSituasjonStep}>
            <CounsellorPanel>
                <FormattedMessage id="step.din_situasjon.veileder.intro" />
            </CounsellorPanel>
            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    name={SoknadFormField.borINorge}
                    legend={intlHelper(intl, 'step.din_situasjon.form.borINorge.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    name={SoknadFormField.arbeiderINorge}
                    legend={intlHelper(intl, 'step.din_situasjon.form.arbeiderINorge.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormBlock>
                <SoknadFormComponents.CheckboxPanelGroup
                    legend={intlHelper(intl, 'step.din_situasjon.form.arbeidssituasjon.spm')}
                    name={SoknadFormField.arbeidssituasjon}
                    checkboxes={getArbeidssituasjonOptions(intl)}
                    validate={validateRequiredList}
                />
            </FormBlock>
            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    name={SoknadFormField.harBruktOmsorgsdagerEtter1Juli}
                    legend={intlHelper(intl, 'step.din_situasjon.form.harBruktOmsorgsdagerEtter1Juli.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {harBruktOmsorgsdagerEtter1Juli === YesOrNo.YES && (
                <FormBlock>
                    <SoknadFormComponents.Input
                        name={SoknadFormField.antallDagerBruktEtter1Juli}
                        label={intlHelper(intl, 'step.din_situasjon.form.antallDagerBruktEtter1Juli.spm')}
                        validate={validateRequiredNumber({ min: 1 })}
                        inputMode="numeric"
                        style={{ maxWidth: '4rem' }}
                        maxLength={2}
                    />
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default DinSituasjon;
