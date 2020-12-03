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
import IntroFormQuestion from './IntroFormQuestion';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData>();

const IntroForm = ({ onValidSubmit }: Props) => {
    const intl = useIntl();

    const getFellesSpm = (values: IntroFormData, aleneomsSpm?: boolean) => {
        return (
            <>
                {aleneomsSpm && (
                    <IntroFormQuestion name={IntroFormField.harAleneomsorg} validate={validateYesOrNoIsAnswered} />
                )}

                <IntroFormQuestion
                    name={IntroFormField.erArbeidstakerSnEllerFrilanser}
                    validate={validateYesOrNoIsAnswered}
                    showStop={values.erArbeidstakerSnEllerFrilanser === YesOrNo.NO}
                    stopMessage={intlHelper(intl, 'introForm.form.erArbeidstakerSnEllerFrilanser.stopMessage')}
                />
                <IntroFormQuestion
                    name={IntroFormField.mottakersArbeidssituasjonErOk}
                    validate={validateRequiredList}
                    showStop={values.mottakersArbeidssituasjonErOk === YesOrNo.NO}
                    stopMessage={intlHelper(intl, 'introForm.form.mottakersArbeidssituasjonErOk.stopMessage')}
                />
            </>
        );
    };

    const getSpm = (values: IntroFormData) => {
        switch (values.korona) {
            case YesOrNo.YES:
                return getFellesSpm(values);
            case YesOrNo.NO:
                return (
                    <>
                        <IntroFormQuestion
                            name={IntroFormField.mottakerErEktefelleEllerSamboer}
                            validate={validateYesOrNoIsAnswered}
                        />
                        {values.mottakerErEktefelleEllerSamboer === YesOrNo.YES && getFellesSpm(values, true)}
                        {values.mottakerErEktefelleEllerSamboer === YesOrNo.NO && (
                            <>
                                <IntroFormQuestion
                                    name={IntroFormField.mottakerSamværsforelder}
                                    validate={validateYesOrNoIsAnswered}
                                    showStop={values.mottakerSamværsforelder === YesOrNo.NO}
                                    stopMessage={intlHelper(intl, 'introForm.form.mottakerSamværsforelder.stopMessage')}
                                />
                                {values.mottakerSamværsforelder === YesOrNo.YES && getFellesSpm(values, true)}
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
                            <IntroFormQuestion
                                name={IntroFormField.korona}
                                validate={validateYesOrNoIsAnswered}
                                description={
                                    <ExpandableInfo title={intlHelper(intl, 'introForm.form.hvaBetyr')}>
                                        {intlHelper(intl, 'introForm.form.korona.hvaBetyr"')}
                                    </ExpandableInfo>
                                }
                            />
                            {getSpm(values)}
                        </IntroFormComponents.Form>
                    </section>
                );
            }}
        />
    );
};

export default IntroForm;
