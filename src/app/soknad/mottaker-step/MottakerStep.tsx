import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateAll,
    validateFødselsnummer,
    validateRequiredField,
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import { Person } from '../../types/Person';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { validateFødselsnummerIsDifferentThan } from '../../validation/fieldValidation';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';

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

type Props = {
    søker: Person;
};

const MottakerStep = ({ søker }: Props) => {
    const intl = useIntl();
    const stepId = StepID.MOTTAKER;
    const {
        values: { overføreTilEktefelle, overføreTilSamboer },
    } = useFormikContext<SoknadFormData>();

    const kanFortsette =
        overføreTilEktefelle === YesOrNo.YES ||
        (overføreTilSamboer === YesOrNo.YES && overføreTilEktefelle === YesOrNo.NO);

    const kanIkkeFortsette = overføreTilEktefelle === YesOrNo.NO && overføreTilSamboer === YesOrNo.NO;

    return (
        <SoknadFormStep id={stepId} showSubmitButton={kanFortsette}>
            <CounsellorPanel>
                <FormattedMessage id="step.mottaker.veileder.intro.1" />

                <ul>
                    <li>{intlHelper(intl, 'arbeidstaker')}</li>
                    <li>{intlHelper(intl, 'selvstendigNæringsdrivende')}</li>
                    <li>{intlHelper(intl, 'frilanser')}</li>
                </ul>
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

            {kanIkkeFortsette && (
                <FormBlock>
                    <AlertStripeAdvarsel>
                        <FormattedHtmlMessage id="step.mottaker.form.stopMessage.html" />
                        <p>
                            <Lenke href={getLenker(intl.locale).meldingOmDelingAvOmsorgsdager} target="_blank">
                                <FormattedMessage id="step.mottaker.form.stopMessage.lenke" />
                            </Lenke>
                        </p>
                    </AlertStripeAdvarsel>
                </FormBlock>
            )}

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
