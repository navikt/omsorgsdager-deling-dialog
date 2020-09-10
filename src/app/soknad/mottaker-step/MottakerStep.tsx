import React from 'react';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateYesOrNoIsAnswered,
    validateFødselsnummer,
    validateRequiredField,
    validateRequiredNumber,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import { SoknadFormField, SoknadFormData } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { validateAll } from '../../../common/utils/fieldValidations';
import { Person } from '../../types/Person';
import { validateFødselsnummerIsDifferentThan } from '../../validation/fieldValidation';
import StopMessage from '../../../common/stop-message/StopMessage';

export const ANTALL_DAGER_RANGE = { min: 1, max: 10 };

const getAntallDagerOptions = (intl: IntlShape): React.ReactNode => {
    const options = [<option key={'none'}></option>];
    let dag = ANTALL_DAGER_RANGE.min;
    while (dag <= ANTALL_DAGER_RANGE.max) {
        options.push(
            <option key={dag} value={dag}>
                {intlHelper(intl, 'dager', { dager: dag })}
            </option>
        );
        dag++;
    }
    return options;
};

type Props = StepConfigProps & {
    søker: Person;
};

const MottakerStep = ({ søker, ...formStepProps }: Props) => {
    const intl = useIntl();
    const stepId = StepID.MOTTAKER;
    const { values } = useFormikContext<SoknadFormData>();
    const { overføreTilEktefelle, overføreTilSamboer } = values;

    const kanFortsette =
        overføreTilEktefelle === YesOrNo.YES ||
        (overføreTilSamboer === YesOrNo.YES && overføreTilEktefelle === YesOrNo.NO);

    const kanIkkeFortsette = overføreTilEktefelle === YesOrNo.NO && overføreTilSamboer === YesOrNo.NO;

    return (
        <SoknadFormStep id={stepId} {...formStepProps} showSubmitButton={kanFortsette}>
            <CounsellorPanel>
                <FormattedMessage id="step.mottaker.veileder.intro" />
            </CounsellorPanel>

            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    name={SoknadFormField.overføreTilEktefelle}
                    legend={intlHelper(intl, 'step.mottaker.form.overføreTilEktefelle.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {overføreTilEktefelle === YesOrNo.NO && (
                <FormBlock>
                    <SoknadFormComponents.YesOrNoQuestion
                        name={SoknadFormField.overføreTilSamboer}
                        legend={intlHelper(intl, 'step.mottaker.form.overføreTilSamboer.spm')}
                        validate={validateYesOrNoIsAnswered}
                    />
                </FormBlock>
            )}

            {kanIkkeFortsette && <StopMessage>Du må velge ...</StopMessage>}

            {kanFortsette && (
                <>
                    <FormBlock>
                        <SoknadFormComponents.Input
                            name={SoknadFormField.fnrMottaker}
                            label={intlHelper(intl, 'step.mottaker.form.fnr.spm')}
                            validate={validateAll([
                                validateFødselsnummer,
                                validateFødselsnummerIsDifferentThan(søker.fødselsnummer),
                            ])}
                            inputMode="numeric"
                            maxLength={11}
                            minLength={11}
                            style={{ maxWidth: '11rem' }}
                        />
                    </FormBlock>
                    <FormBlock>
                        <SoknadFormComponents.Input
                            name={SoknadFormField.navnMottaker}
                            label={intlHelper(intl, 'step.mottaker.form.navn.spm')}
                            validate={validateRequiredField}
                        />
                    </FormBlock>
                    <FormBlock>
                        <SoknadFormComponents.Select
                            name={SoknadFormField.antallDagerSomSkalOverføres}
                            label={intlHelper(intl, 'step.mottaker.form.antallDagerSomSkalOverføres.spm')}
                            validate={validateAll([validateRequiredNumber(ANTALL_DAGER_RANGE)])}
                            bredde="s">
                            {getAntallDagerOptions(intl)}
                        </SoknadFormComponents.Select>
                    </FormBlock>
                </>
            )}
        </SoknadFormStep>
    );
};

export default MottakerStep;
