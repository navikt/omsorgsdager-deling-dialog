import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { QuestionVisibilityContext } from '@navikt/sif-common-soknad/lib/question-visibility/QuestionVisibilityContext';
import { useFormikContext } from 'formik';
import { RadioPanelProps } from 'nav-frontend-skjema';
import StepIntroduction from '../../components/step-introduction/StepIntroduction';
import { Person } from '../../types/Person';
import { Mottaker, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormQuestion from '../SoknadFormQuestion';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import { getMottakerFormStopp, MottakerFormQuestions } from './mottakerStepFormConfig';
import {
    validateFødselsnummer,
    ValidateFødselsnummerErrors,
    validateNumber,
    ValidateNumberErrors,
    validateRequiredValue,
    validateString,
    ValidateStringErrors,
    validateYesOrNo,
} from '@navikt/sif-common-formik/lib/validation';
import { getUnhandledValidationMessage, reportUnhandledValidationError } from '../../validation/fieldValidation';

export const ANTALL_DAGER_RANGE = { min: 1, max: 10 };
export const ANTALL_DAGER_KORONA_RANGE = { min: 1, max: 999 };

const getAntallDagerOptions = (intl: IntlShape): React.ReactNode => {
    const options = [<option key={'none'}></option>];
    let dag = ANTALL_DAGER_RANGE.min;
    while (dag <= ANTALL_DAGER_RANGE.max) {
        options.push(
            <option key={dag} value={dag.toString()}>
                {intlHelper(intl, 'dager', { dager: dag.toString() })}
            </option>
        );
        dag++;
    }
    return options;
};

type Props = {
    søker: Person;
};

const cleanupMottakerStep = (formData: SoknadFormData): SoknadFormData => {
    const gjelderKorona = formData.gjelderMidlertidigPgaKorona === YesOrNo.YES;

    return {
        ...formData,
        ...(gjelderKorona
            ? {
                  mottakerType: undefined,
              }
            : {
                  skalDeleMedAndreForelderSamboerEktefelle: YesOrNo.UNANSWERED,
              }),
    };
};

const getMottakertypeRadios = (intl: IntlShape): RadioPanelProps[] => {
    return [
        {
            label: intlHelper(intl, `step.mottaker.form.mottakerType.${Mottaker.samværsforelder}`),
            value: Mottaker.samværsforelder,
        },
        {
            label: intlHelper(intl, `step.mottaker.form.mottakerType.${Mottaker.ektefelle}`),
            value: Mottaker.ektefelle,
        },
        {
            label: intlHelper(intl, `step.mottaker.form.mottakerType.${Mottaker.samboer}`),
            value: Mottaker.samboer,
        },
    ];
};

const MottakerStep: React.FunctionComponent<Props> = ({ søker }) => {
    const intl = useIntl();
    const stepId = StepID.MOTTAKER;
    const { values } = useFormikContext<SoknadFormData>();
    const stopp = getMottakerFormStopp(values);
    const visibility = MottakerFormQuestions.getVisbility(values);

    const allQuestionsIsAnswered = visibility.areAllQuestionsAnswered();
    const kanFortsette = allQuestionsIsAnswered && stopp === undefined;
    const { gjelderMidlertidigPgaKorona, skalDeleMedAndreForelderSamboerEktefelle } = values;

    return (
        <SoknadFormStep
            id={stepId}
            showSubmitButton={kanFortsette}
            onStepCleanup={cleanupMottakerStep}
            showNotAllQuestionsAnsweredMessage={visibility.areAllQuestionsAnswered() === false}>
            <StepIntroduction>
                <p>{intlHelper(intl, 'step.mottaker.veileder.1')}</p>
                <p>{intlHelper(intl, 'step.mottaker.veileder.2')}</p>
                <ul>
                    <li>
                        <ExpandableInfo
                            title={intlHelper(intl, 'step.mottaker.veileder.2.nedtrek.tittel')}
                            filledBackground={false}>
                            {intlHelper(intl, 'step.mottaker.veileder.2.nedtrek')}
                        </ExpandableInfo>
                    </li>
                    <li>
                        <ExpandableInfo
                            title={intlHelper(intl, 'step.mottaker.veileder.3.nedterk.tittel')}
                            filledBackground={false}>
                            <p>{intlHelper(intl, 'step.mottaker.veileder.4')}</p>
                            <ul>
                                <li>{intlHelper(intl, 'step.mottaker.veileder.4.1')}</li>
                                <li>{intlHelper(intl, 'step.mottaker.veileder.4.2')}</li>
                            </ul>
                            <p>{intlHelper(intl, 'step.mottaker.veileder.5')}</p>
                        </ExpandableInfo>
                    </li>
                    <li>
                        <ExpandableInfo
                            title={intlHelper(intl, 'step.mottaker.veileder.5.nedtrek.1.tittel')}
                            filledBackground={false}>
                            {intlHelper(intl, 'step.mottaker.veileder.5.nedtrek.1.2021')}
                        </ExpandableInfo>
                    </li>
                </ul>
            </StepIntroduction>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <SoknadFormQuestion
                    name={SoknadFormField.gjelderMidlertidigPgaKorona}
                    legend={intlHelper(intl, 'step.mottaker.form.gjelderMidlertidigPgaKorona.spm')}
                    validate={(value) => {
                        const error = validateYesOrNo(value);
                        return error
                            ? intlHelper(intl, 'validation.gjelderMidlertidigPgaKorona.unanswered')
                            : undefined;
                    }}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'hvaBetyrDette')}>
                            {intlHelper(intl, 'step.mottaker.form.gjelderMidlertidigPgaKorona.hvaBetyr.svar')}
                        </ExpandableInfo>
                    }
                />

                <SoknadFormQuestion
                    name={SoknadFormField.skalDeleMedAndreForelderSamboerEktefelle}
                    legend={intlHelper(intl, 'step.mottaker.form.skalDeleMedAndreForelderSamboerEktefelle.spm')}
                    validate={(value) => {
                        const error = validateYesOrNo(value);
                        return error
                            ? intlHelper(intl, 'validation.skalDeleMedAndreForelderSamboerEktefelle.unanswered')
                            : undefined;
                    }}
                    showStop={skalDeleMedAndreForelderSamboerEktefelle === YesOrNo.NO}
                    stopMessage={<FormattedHtmlMessage id="step.mottaker.form.stopMessage.korona.html" />}
                />

                <SoknadFormQuestion name={SoknadFormField.mottakerType}>
                    <SoknadFormComponents.RadioPanelGroup
                        name={SoknadFormField.mottakerType}
                        legend={intlHelper(intl, 'step.mottaker.form.mottakerType.spm')}
                        validate={(value) => {
                            const error = validateRequiredValue(value);
                            return error ? intlHelper(intl, 'validation.mottakerType.unanswered') : undefined;
                        }}
                        radios={getMottakertypeRadios(intl)}
                        description={
                            <ExpandableInfo
                                title={intlHelper(
                                    intl,
                                    'step.mottaker.form.mottakerType.ingenValgt.infoVarsel.hvaBetyr'
                                )}>
                                {intlHelper(intl, 'step.mottaker.form.mottakerType.ingenValgt.infoVarsel')}
                            </ExpandableInfo>
                        }
                    />
                </SoknadFormQuestion>

                <SoknadFormQuestion name={SoknadFormField.fnrMottaker}>
                    <SoknadFormComponents.Input
                        name={SoknadFormField.fnrMottaker}
                        label={intlHelper(intl, 'step.mottaker.form.fnr.spm')}
                        validate={(value) => {
                            const error = validateFødselsnummer({
                                required: true,
                                disallowedValues: [søker.fødselsnummer],
                            })(value);
                            switch (error) {
                                case undefined:
                                    return undefined;
                                case ValidateFødselsnummerErrors.noValue:
                                    return intlHelper(intl, 'validation.fnrMottaker.noValue');
                                case ValidateFødselsnummerErrors.fødselsnummerNot11Chars:
                                    return intlHelper(intl, 'validation.fnrMottaker.fødselsnummerNot11Chars');
                                case ValidateFødselsnummerErrors.invalidFødselsnummer:
                                case ValidateFødselsnummerErrors.fødselsnummerChecksumError:
                                    return intlHelper(intl, 'validation.fnrMottaker.invalidValue');
                                default:
                                    reportUnhandledValidationError(error, SoknadFormField.fnrMottaker);
                                    return getUnhandledValidationMessage(intl, error);
                            }
                        }}
                        inputMode="numeric"
                        maxLength={11}
                        minLength={11}
                        style={{ maxWidth: '11rem' }}
                    />
                </SoknadFormQuestion>

                <SoknadFormQuestion name={SoknadFormField.navnMottaker}>
                    <SoknadFormComponents.Input
                        name={SoknadFormField.navnMottaker}
                        label={intlHelper(intl, 'step.mottaker.form.navn.spm')}
                        validate={(value) => {
                            const error = validateString({ required: true, minLength: 2, maxLength: 50 })(value);
                            switch (error) {
                                case undefined:
                                    return undefined;
                                case ValidateStringErrors.noValue:
                                    return intlHelper(intl, 'validation.navnMottaker.unanswered');
                                case ValidateStringErrors.tooLong:
                                    return intlHelper(intl, 'validation.navnMottaker.tooLong');
                                case ValidateStringErrors.tooShort:
                                    return intlHelper(intl, 'validation.navnMottaker.tooShort');
                                default:
                                    reportUnhandledValidationError(error, SoknadFormField.navnMottaker);
                                    return getUnhandledValidationMessage(intl, error);
                            }
                        }}
                    />
                </SoknadFormQuestion>

                <SoknadFormQuestion name={SoknadFormField.antallDagerSomSkalOverføres}>
                    {gjelderMidlertidigPgaKorona === YesOrNo.NO && (
                        <SoknadFormComponents.Select
                            name={SoknadFormField.antallDagerSomSkalOverføres}
                            label={intlHelper(intl, 'step.mottaker.form.antallDagerSomSkalOverføres.spm')}
                            validate={(value) => {
                                const error = validateRequiredValue(value);
                                return error ? intlHelper(intl, '') : undefined;
                            }}
                            bredde="s"
                            description={
                                <ExpandableInfo
                                    title={intlHelper(
                                        intl,
                                        'step.mottaker.form.antallDagerSomSkalOverføres.nedtrekk.titel'
                                    )}>
                                    {intlHelper(
                                        intl,
                                        'step.mottaker.form.antallDagerSomSkalOverføres.nedtrekk.svar.nåværendeSamboerEllerEktefelle'
                                    )}
                                </ExpandableInfo>
                            }>
                            {getAntallDagerOptions(intl)}
                        </SoknadFormComponents.Select>
                    )}
                    {gjelderMidlertidigPgaKorona === YesOrNo.YES && (
                        <SoknadFormComponents.NumberInput
                            name={SoknadFormField.antallDagerSomSkalOverføres}
                            label={intlHelper(intl, 'step.mottaker.form.antallDagerSomSkalOverføres.spm')}
                            validate={(value) => {
                                const min = ANTALL_DAGER_RANGE.min;
                                const max = ANTALL_DAGER_RANGE.max;

                                const error = validateNumber({
                                    required: true,
                                    min,
                                    max,
                                })(value);

                                switch (error) {
                                    case undefined:
                                        return undefined;
                                    case ValidateNumberErrors.noValue:
                                        return intlHelper(intl, 'validation.antallDagerSomSkalOverføres.noValue');
                                    case ValidateNumberErrors.invalidFormat:
                                        return intlHelper(intl, 'validation.antallDagerSomSkalOverføres.invalidFormat');
                                    case ValidateNumberErrors.tooSmall:
                                        return intlHelper(intl, 'validation.antallDagerSomSkalOverføres.tooSmall', {
                                            min,
                                        });
                                    case ValidateNumberErrors.tooLarge:
                                        return intlHelper(intl, 'validation.antallDagerSomSkalOverføres.tooLarge', {
                                            max,
                                        });
                                    default:
                                        reportUnhandledValidationError(
                                            error,
                                            SoknadFormField.antallDagerSomSkalOverføres
                                        );
                                        return getUnhandledValidationMessage(intl, error);
                                }
                            }}
                            bredde="XS"
                            description={
                                <ExpandableInfo
                                    title={intlHelper(
                                        intl,
                                        'step.mottaker.form.antallDagerSomSkalOverføres.nedtrekk.titel'
                                    )}>
                                    {intlHelper(
                                        intl,
                                        'step.mottaker.form.antallDagerSomSkalOverføres.nedtrekk.svar.korona2021'
                                    )}
                                </ExpandableInfo>
                            }
                            maxLength={3}
                        />
                    )}
                </SoknadFormQuestion>
            </QuestionVisibilityContext.Provider>
        </SoknadFormStep>
    );
};

export default MottakerStep;
