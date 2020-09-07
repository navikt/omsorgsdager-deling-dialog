import React from 'react';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateYesOrNoIsAnswered,
    validateFødselsnummer,
    validateRequiredField,
    validateRequiredSelect,
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

const getAntallDagerOptions = (intl: IntlShape): React.ReactNode => {
    const dager = [<option key={'none'}></option>];
    let cnt = 1;
    while (cnt <= 10) {
        dager.push(<option key={cnt}>{intlHelper(intl, 'dager', { dager: cnt })}</option>);
        cnt++;
    }
    return dager;
};

type Props = StepConfigProps & {
    søker: Person;
};

const MottakerStep = ({ søker, onResetSoknad, onValidSubmit, soknadStepsConfig }: Props) => {
    const intl = useIntl();
    const stepId = StepID.MOTTAKER;
    const { values } = useFormikContext<SoknadFormData>();
    const { overføreTilEktefelle, overføreTilPartner } = values;

    const kanFortsette =
        overføreTilEktefelle === YesOrNo.YES ||
        (overføreTilPartner === YesOrNo.YES && overføreTilEktefelle === YesOrNo.NO);

    const kanIkkeFortsette = overføreTilEktefelle === YesOrNo.NO && overføreTilPartner === YesOrNo.NO;

    return (
        <SoknadFormStep
            id={stepId}
            soknadStepsConfig={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            showSubmitButton={kanFortsette}
            onValidSubmit={onValidSubmit}>
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
                        name={SoknadFormField.overføreTilPartner}
                        legend={intlHelper(intl, 'step.mottaker.form.overføreTilPartner.spm')}
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
                            validate={validateRequiredSelect}
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
