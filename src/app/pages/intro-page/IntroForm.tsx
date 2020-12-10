import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents, UnansweredQuestionsInfo } from '@navikt/sif-common-formik';
import { IntroFormData, IntroFormField, introFormInitialValues } from './introFormConfig';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormQuestion from '@navikt/sif-common-soknad/lib/form-question/FormQuestion';

interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData>();

const IntroForm = ({ onValidSubmit }: Props) => {
    const intl = useIntl();

    const getCommonQuestions = (values: IntroFormData, addAleneomssorgQuestion?: boolean) => {
        return (
            <>
                {addAleneomssorgQuestion && (
                    <FormQuestion
                        legend={intlHelper(intl, `introForm.form.${IntroFormField.harAleneomsorg}.spm`)}
                        name={IntroFormField.harAleneomsorg}
                        validate={validateYesOrNoIsAnswered}
                    />
                )}

                <FormQuestion
                    legend={intlHelper(intl, `introForm.form.${IntroFormField.erArbeidstakerSnEllerFrilanser}.spm`)}
                    name={IntroFormField.erArbeidstakerSnEllerFrilanser}
                    validate={validateYesOrNoIsAnswered}
                    showStop={values.erArbeidstakerSnEllerFrilanser === YesOrNo.NO}
                    stopMessage={intlHelper(intl, 'introForm.form.erArbeidstakerSnEllerFrilanser.stopMessage')}
                />
                {values.erArbeidstakerSnEllerFrilanser === YesOrNo.YES && (
                    <FormQuestion
                        legend={intlHelper(intl, `introForm.form.${IntroFormField.mottakersArbeidssituasjonErOk}.spm`)}
                        name={IntroFormField.mottakersArbeidssituasjonErOk}
                        validate={validateRequiredList}
                        showStop={values.mottakersArbeidssituasjonErOk === YesOrNo.NO}
                        stopMessage={intlHelper(intl, 'introForm.form.mottakersArbeidssituasjonErOk.stopMessage')}
                    />
                )}
            </>
        );
    };

    const getQuestions = (values: IntroFormData) => {
        switch (values.korona) {
            case YesOrNo.YES:
                return getCommonQuestions(values);
            case YesOrNo.NO:
                return (
                    <>
                        <FormQuestion
                            legend={intlHelper(
                                intl,
                                `introForm.form.${IntroFormField.mottakerErEktefelleEllerSamboer}.spm`
                            )}
                            name={IntroFormField.mottakerErEktefelleEllerSamboer}
                            validate={validateYesOrNoIsAnswered}
                        />
                        {values.mottakerErEktefelleEllerSamboer === YesOrNo.YES && getCommonQuestions(values, true)}
                        {values.mottakerErEktefelleEllerSamboer === YesOrNo.NO && (
                            <>
                                <FormQuestion
                                    legend={intlHelper(
                                        intl,
                                        `introForm.form.${IntroFormField.mottakerSamværsforelder}.spm`
                                    )}
                                    name={IntroFormField.mottakerSamværsforelder}
                                    validate={validateYesOrNoIsAnswered}
                                    showStop={values.mottakerSamværsforelder === YesOrNo.NO}
                                    stopMessage={intlHelper(intl, 'introForm.form.mottakerSamværsforelder.stopMessage')}
                                />
                                {values.mottakerSamværsforelder === YesOrNo.YES && getCommonQuestions(values, true)}
                            </>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    const kanFortsetteFn = (values: IntroFormData): boolean => {
        const arbeidsSituasjonErOkHosBegge =
            values.erArbeidstakerSnEllerFrilanser === YesOrNo.YES &&
            values.mottakersArbeidssituasjonErOk === YesOrNo.YES;

        const kanFortsetteKorona = values.korona === YesOrNo.YES && arbeidsSituasjonErOkHosBegge;

        const kanFortsetteVanlig =
            values.korona === YesOrNo.NO &&
            values.mottakerErEktefelleEllerSamboer === YesOrNo.YES &&
            arbeidsSituasjonErOkHosBegge;

        const kanFortsetteSamværsforelder =
            values.korona === YesOrNo.NO &&
            values.mottakerErEktefelleEllerSamboer === YesOrNo.NO &&
            values.mottakerSamværsforelder === YesOrNo.YES &&
            arbeidsSituasjonErOkHosBegge;

        return kanFortsetteKorona || kanFortsetteVanlig || kanFortsetteSamværsforelder;
    };

    return (
        <IntroFormComponents.FormikWrapper
            initialValues={introFormInitialValues}
            onSubmit={() => {
                onValidSubmit();
            }}
            renderForm={({ values }) => {
                const kanFortsette = kanFortsetteFn(values);
                return (
                    <section aria-label="Se om du kan bruke det dette skjemaet:">
                        <IntroFormComponents.Form
                            includeValidationSummary={true}
                            includeButtons={kanFortsette}
                            noButtonsContentRenderer={
                                kanFortsette
                                    ? undefined
                                    : () => (
                                          <UnansweredQuestionsInfo>
                                              <FormattedMessage id="page.form.ubesvarteSpørsmålInfo" />
                                          </UnansweredQuestionsInfo>
                                      )
                            }
                            fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                            submitButtonLabel={intlHelper(intl, 'introForm.start')}>
                            <FormQuestion
                                legend={intlHelper(intl, `introForm.form.${IntroFormField.korona}.spm`)}
                                name={IntroFormField.korona}
                                validate={validateYesOrNoIsAnswered}
                                description={
                                    <ExpandableInfo title={intlHelper(intl, 'introForm.form.hvaBetyr')}>
                                        {intlHelper(intl, 'introForm.form.korona.hvaBetyr')}
                                    </ExpandableInfo>
                                }
                            />
                            {getQuestions(values)}
                        </IntroFormComponents.Form>
                    </section>
                );
            }}
        />
    );
};

export default IntroForm;
