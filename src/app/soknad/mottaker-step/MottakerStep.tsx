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
import { AlertStripeInfo, AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Person } from '../../types/Person';
import { Mottaker, Stengingsperiode, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { validateFødselsnummerIsDifferentThan } from '../../validation/fieldValidation';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Lenke from 'nav-frontend-lenker';

export const ANTALL_DAGER_RANGE = { min: 1, max: 10 };
export const ANTALL_DAGER_KORONA_RANGE = { min: 1, max: 100 };

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

const MottakerStep = ({ søker }: Props) => {
    const intl = useIntl();
    const stepId = StepID.MOTTAKER;
    const { values } = useFormikContext<SoknadFormData>();

    const {
        gjelderMidlertidigPgaKorona,
        skalDeleMedAndreForelderSamboerEktefelle,
        mottakerType,
        stengingsperiode,
    } = values;

    const kanFortsette =
        (gjelderMidlertidigPgaKorona === YesOrNo.YES &&
            skalDeleMedAndreForelderSamboerEktefelle === YesOrNo.YES &&
            stengingsperiode !== Stengingsperiode.annen) ||
        gjelderMidlertidigPgaKorona === YesOrNo.NO;

    const getMottakerTypeSpm = () => {
        return (
            <>
                <FormBlock>
                    <SoknadFormComponents.RadioPanelGroup
                        name={SoknadFormField.mottakerType}
                        legend={intlHelper(intl, 'step.mottaker.form.mottakerType.spm')}
                        validate={validateYesOrNoIsAnswered}
                        radios={[
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
                        ]}
                    />
                </FormBlock>
            </>
        );
    };

    const getMottakersPersOpplysningerSpm = () => {
        return (
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
            </>
        );
    };
    const getStengingsperiode = () => {
        return (
            <>
                <FormBlock>
                    <SoknadFormComponents.RadioPanelGroup
                        name={SoknadFormField.stengingsperiode}
                        legend={intlHelper(intl, 'step.mottaker.form.stengingsperiode.spm')}
                        validate={validateYesOrNoIsAnswered}
                        radios={[
                            {
                                label: intlHelper(
                                    intl,
                                    `step.mottaker.form.stengingsperiode.${Stengingsperiode.fra13marsTil30Juni2020}`
                                ),
                                value: Stengingsperiode.fra13marsTil30Juni2020,
                            },
                            {
                                label: intlHelper(
                                    intl,
                                    `step.mottaker.form.stengingsperiode.${Stengingsperiode.fraOgMed10August2020EllerSenere}`
                                ),
                                value: Stengingsperiode.fraOgMed10August2020EllerSenere,
                            },
                            {
                                label: intlHelper(
                                    intl,
                                    `step.mottaker.form.stengingsperiode.${Stengingsperiode.annen}`
                                ),
                                value: Stengingsperiode.annen,
                            },
                        ]}
                    />
                </FormBlock>
                {values.stengingsperiode && values.stengingsperiode === Stengingsperiode.annen && (
                    <FormBlock>
                        <AlertStripeAdvarsel>
                            <FormattedMessage id="step.mottaker.form.stengingsperiode.annen.stopMelding.1" />
                            <br />
                            <FormattedMessage id="step.mottaker.form.stengingsperiode.annen.stopMelding.2.a" />{' '}
                            <Lenke
                                href="https://www.nav.no/familie/sykdom-i-familien/nb/omsorgspenger#Slik-kan-du-dele-omsorgsdagene-dine"
                                target="_blank">
                                <FormattedMessage id="step.mottaker.form.stengingsperiode.annen.stopMelding.2.b" />
                            </Lenke>
                            .
                        </AlertStripeAdvarsel>
                    </FormBlock>
                )}
            </>
        );
    };
    const getAntallDagerSpm = () => {
        return (
            <FormBlock>
                <SoknadFormComponents.Select
                    name={SoknadFormField.antallDagerSomSkalOverføres}
                    label={intlHelper(intl, 'step.mottaker.form.antallDagerSomSkalOverføres.spm')}
                    validate={validateAll([validateRequiredNumber(ANTALL_DAGER_RANGE)])}
                    bredde="s">
                    {getAntallDagerOptions(intl)}
                </SoknadFormComponents.Select>
            </FormBlock>
        );
    };
    const getAntallDagerSpmKorona = () => {
        return (
            <>
                <FormBlock>
                    <SoknadFormComponents.Input
                        name={SoknadFormField.antallDagerSomSkalOverføres}
                        label={intlHelper(intl, 'step.mottaker.form.antallDagerSomSkalOverføres.korona.spm')}
                        validate={validateAll([validateRequiredNumber(ANTALL_DAGER_KORONA_RANGE)])}
                        inputMode="numeric"
                        bredde="XS"
                        min={ANTALL_DAGER_KORONA_RANGE.min}
                        max={ANTALL_DAGER_KORONA_RANGE.max}
                    />
                </FormBlock>
            </>
        );
    };
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
            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    name={SoknadFormField.gjelderMidlertidigPgaKorona}
                    legend={intlHelper(intl, 'step.mottaker.form.gjelderMidlertidigPgaKorona.spm')}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'hvaBetyrDette')}>
                            {intlHelper(intl, 'step.mottaker.form.gjelderMidlertidigPgaKorona.hvaBetyr.svar')}
                        </ExpandableInfo>
                    }
                />
            </FormBlock>

            {gjelderMidlertidigPgaKorona === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={SoknadFormField.skalDeleMedAndreForelderSamboerEktefelle}
                            legend={intlHelper(intl, 'step.mottaker.form.skalDeleMedAndreForelderSamboerEktefelle.spm')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
                    {skalDeleMedAndreForelderSamboerEktefelle === YesOrNo.NO && (
                        <FormBlock>
                            <AlertStripeAdvarsel>
                                <FormattedHtmlMessage id="step.mottaker.form.stopMessage.korona.html" />
                            </AlertStripeAdvarsel>
                        </FormBlock>
                    )}
                </>
            )}

            {gjelderMidlertidigPgaKorona === YesOrNo.NO && getMottakerTypeSpm()}

            {((gjelderMidlertidigPgaKorona === YesOrNo.YES &&
                skalDeleMedAndreForelderSamboerEktefelle === YesOrNo.YES) ||
                (gjelderMidlertidigPgaKorona === YesOrNo.NO && mottakerType)) && (
                <>
                    {getMottakersPersOpplysningerSpm()}

                    {gjelderMidlertidigPgaKorona === YesOrNo.NO &&
                        mottakerType !== Mottaker.samværsforelder &&
                        getAntallDagerSpm()}
                    {gjelderMidlertidigPgaKorona === YesOrNo.YES && getStengingsperiode()}
                    {gjelderMidlertidigPgaKorona === YesOrNo.YES && getAntallDagerSpmKorona()}
                </>
            )}

            {gjelderMidlertidigPgaKorona === YesOrNo.NO && !mottakerType && (
                <FormBlock>
                    <AlertStripeInfo>
                        <FormattedHtmlMessage id="step.mottaker.form.mottakerType.ingenValgt.infoVarsel" />
                    </AlertStripeInfo>
                </FormBlock>
            )}
        </SoknadFormStep>
    );
};

export default MottakerStep;
