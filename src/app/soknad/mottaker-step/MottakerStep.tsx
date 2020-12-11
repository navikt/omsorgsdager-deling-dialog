import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
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
import { QuestionVisibilityContext } from '@navikt/sif-common-soknad/lib/question-visibility/QuestionVisibilityContext';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import { RadioPanelProps } from 'nav-frontend-skjema';
import { Person } from '../../types/Person';
import { Mottaker, SoknadFormData, SoknadFormField, Stengingsperiode } from '../../types/SoknadFormData';
import { validateFødselsnummerIsDifferentThan } from '../../validation/fieldValidation';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import SoknadFormQuestion from '../SoknadFormQuestion';
import { getMottakerFormStopp, MottakerFormQuestions, MottakerFormStopp } from './mottakerStepFormConfig';
import * as dayjs from 'dayjs';

export const ANTALL_DAGER_RANGE = { min: 1, max: 10 };
export const ANTALL_DAGER_KORONA_RANGE = { min: 1, max: 999 };

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
                  stengingsperiode: undefined,
              }),
    };
};

const getMottakertypeRadios = (intl: IntlShape): RadioPanelProps[] => {
    return [
        {
            label: intlHelper(intl, `step.mottaker.form.mottakerType.${Mottaker.ektefelle}`),
            value: Mottaker.ektefelle,
        },
        {
            label: intlHelper(intl, `step.mottaker.form.mottakerType.${Mottaker.samboer}`),
            value: Mottaker.samboer,
        },
        {
            label: intlHelper(intl, `step.mottaker.form.mottakerType.${Mottaker.samværsforelder}`),
            value: Mottaker.samværsforelder,
        },
    ];
};

const getStengningsperiodeRadios = (intl: IntlShape): RadioPanelProps[] => {
    const stengningsperiodeRadios = [
        {
            label: intlHelper(intl, `step.mottaker.form.stengingsperiode.${Stengingsperiode.fra13marsTil30Juni2020}`),
            value: Stengingsperiode.fra13marsTil30Juni2020,
        },
        {
            label: intlHelper(
                intl,
                `step.mottaker.form.stengingsperiode.${Stengingsperiode.fraOgMed10August2020til31Desember2020}`
            ),
            value: Stengingsperiode.fraOgMed10August2020til31Desember2020,
        },
        {
            label: intlHelper(
                intl,
                `step.mottaker.form.stengingsperiode.${Stengingsperiode.fraOgMed1januar2021til31Desember2021}`
            ),
            value: Stengingsperiode.fraOgMed1januar2021til31Desember2021,
        },
        {
            label: intlHelper(intl, `step.mottaker.form.stengingsperiode.${Stengingsperiode.annen}`),
            value: Stengingsperiode.annen,
        },
    ];

    return dayjs().isBefore(dayjs('2021-01-01'))
        ? stengningsperiodeRadios.filter(
              (radioBtn) => radioBtn.value !== Stengingsperiode.fraOgMed1januar2021til31Desember2021
          )
        : stengningsperiodeRadios;
};

const MottakerStep = ({ søker }: Props) => {
    const intl = useIntl();
    const stepId = StepID.MOTTAKER;
    const { values } = useFormikContext<SoknadFormData>();
    const stopp = getMottakerFormStopp(values);
    const visibility = MottakerFormQuestions.getVisbility(values);

    const kanFortsette = visibility.areAllQuestionsAnswered() && stopp === undefined;
    const { gjelderMidlertidigPgaKorona, skalDeleMedAndreForelderSamboerEktefelle } = values;

    return (
        <SoknadFormStep id={stepId} showSubmitButton={kanFortsette} onStepCleanup={cleanupMottakerStep}>
            <CounsellorPanel>
                <FormattedMessage id="step.mottaker.veileder.intro.1" />
                <Box margin="m">
                    <FormattedMessage id="step.mottaker.veileder.intro.2" />
                    <ul>
                        <li>{intlHelper(intl, 'arbeidstaker')}</li>
                        <li>{intlHelper(intl, 'selvstendigNæringsdrivende')}</li>
                        <li>{intlHelper(intl, 'frilanser')}</li>
                    </ul>
                </Box>
            </CounsellorPanel>

            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <SoknadFormQuestion
                    name={SoknadFormField.gjelderMidlertidigPgaKorona}
                    legend={intlHelper(intl, 'step.mottaker.form.gjelderMidlertidigPgaKorona.spm')}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'hvaBetyrDette')}>
                            {intlHelper(intl, 'step.mottaker.form.gjelderMidlertidigPgaKorona.hvaBetyr.svar')}
                        </ExpandableInfo>
                    }
                />

                <SoknadFormQuestion
                    name={SoknadFormField.skalDeleMedAndreForelderSamboerEktefelle}
                    legend={intlHelper(intl, 'step.mottaker.form.skalDeleMedAndreForelderSamboerEktefelle.spm')}
                    validate={validateYesOrNoIsAnswered}
                    showStop={skalDeleMedAndreForelderSamboerEktefelle === YesOrNo.NO}
                    stopMessage={<FormattedHtmlMessage id="step.mottaker.form.stopMessage.korona.html" />}
                />

                <SoknadFormQuestion name={SoknadFormField.mottakerType}>
                    <SoknadFormComponents.RadioPanelGroup
                        name={SoknadFormField.mottakerType}
                        legend={intlHelper(intl, 'step.mottaker.form.mottakerType.spm')}
                        validate={validateYesOrNoIsAnswered}
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
                        validate={validateAll([
                            validateFødselsnummer,
                            validateFødselsnummerIsDifferentThan(søker.fødselsnummer),
                        ])}
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
                        validate={validateRequiredField}
                    />
                </SoknadFormQuestion>

                <SoknadFormQuestion
                    name={SoknadFormField.stengingsperiode}
                    showStop={stopp === MottakerFormStopp.koronaAnnenStengingsperiode}
                    stopMessage={
                        <>
                            <FormattedMessage id="step.mottaker.form.stengingsperiode.annen.stopMelding.1" />
                            <br />
                            <FormattedMessage id="step.mottaker.form.stengingsperiode.annen.stopMelding.2.a" />{' '}
                            <Lenke
                                href="https://www.nav.no/familie/sykdom-i-familien/nb/omsorgspenger#Slik-kan-du-dele-omsorgsdagene-dine"
                                target="_blank">
                                <FormattedMessage id="step.mottaker.form.stengingsperiode.annen.stopMelding.2.b" />
                            </Lenke>
                            .
                        </>
                    }>
                    <SoknadFormComponents.RadioPanelGroup
                        name={SoknadFormField.stengingsperiode}
                        legend={intlHelper(intl, 'step.mottaker.form.stengingsperiode.spm')}
                        validate={validateYesOrNoIsAnswered}
                        radios={getStengningsperiodeRadios(intl)}
                    />
                </SoknadFormQuestion>

                <SoknadFormQuestion name={SoknadFormField.antallDagerSomSkalOverføres}>
                    {gjelderMidlertidigPgaKorona === YesOrNo.NO && (
                        <SoknadFormComponents.Select
                            name={SoknadFormField.antallDagerSomSkalOverføres}
                            label={intlHelper(intl, 'step.mottaker.form.antallDagerSomSkalOverføres.spm')}
                            validate={validateAll([validateRequiredNumber(ANTALL_DAGER_RANGE)])}
                            bredde="s">
                            {getAntallDagerOptions(intl)}
                        </SoknadFormComponents.Select>
                    )}
                    {gjelderMidlertidigPgaKorona === YesOrNo.YES && (
                        <SoknadFormComponents.Input
                            name={SoknadFormField.antallDagerSomSkalOverføres}
                            label={intlHelper(intl, 'step.mottaker.form.antallDagerSomSkalOverføres.korona.spm')}
                            validate={validateAll([validateRequiredNumber(ANTALL_DAGER_KORONA_RANGE)])}
                            inputMode="numeric"
                            bredde="XS"
                            min={ANTALL_DAGER_KORONA_RANGE.min}
                            max={ANTALL_DAGER_KORONA_RANGE.max}
                        />
                    )}
                </SoknadFormQuestion>
            </QuestionVisibilityContext.Provider>
        </SoknadFormStep>
    );
};

export default MottakerStep;
