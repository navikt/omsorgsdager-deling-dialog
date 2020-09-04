import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { QuestionVisibilityContext } from '../../../common/context/QuestionVisibilityContext';
import { getTypedFormQuestion } from '../../../common/form-question/FormQuestion';
import QuestionVisibilityBlock from '../../../common/question-visibility-block/QuestionVisibilityBlock';
import { navigateToSoknadFrontpage } from '../../utils/navigationUtils';
import {
    getIntroFormAvslag,
    IntroFormAvslag,
    IntroFormData,
    IntroFormField,
    introFormInitialValues,
    IntroFormQuestions,
} from './introFormConfig';

interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData>();

const getIntroFormLegend = (intl: IntlShape, field: IntroFormField): string => {
    return intlHelper(intl, `introForm.${field}.spm`);
};

const IntroFormQuestion = getTypedFormQuestion<IntroFormField>();

const IntroForm = ({ onValidSubmit }: Props) => {
    const intl = useIntl();
    const history = useHistory();

    return (
        <IntroFormComponents.FormikWrapper
            initialValues={introFormInitialValues}
            onSubmit={onValidSubmit}
            renderForm={({ values }) => {
                const avslag = getIntroFormAvslag(values);
                const visibility = IntroFormQuestions.getVisbility({
                    ...values,
                    avslag,
                });

                const kanFortsette = avslag === undefined && visibility.areAllQuestionsAnswered();

                return (
                    <IntroFormComponents.Form
                        includeValidationSummary={true}
                        includeButtons={kanFortsette}
                        onValidSubmit={() => {
                            navigateToSoknadFrontpage(history);
                        }}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel={'Start melding om overføring'}>
                        <QuestionVisibilityContext.Provider value={{ visibility }}>
                            <QuestionVisibilityBlock fieldName={IntroFormField.erArbeidstakerSnEllerFrilanser}>
                                <IntroFormQuestion
                                    name={IntroFormField.erArbeidstakerSnEllerFrilanser}
                                    legend={getIntroFormLegend(intl, IntroFormField.erArbeidstakerSnEllerFrilanser)}
                                    validate={validateYesOrNoIsAnswered}
                                    showStop={avslag === IntroFormAvslag.erIkkeArbeidstakerSnEllerFrilanser}
                                    stopMessage={<>Lorem ipsum</>}
                                />
                            </QuestionVisibilityBlock>
                            <QuestionVisibilityBlock fieldName={IntroFormField.harAleneomsorg}>
                                <IntroFormQuestion
                                    name={IntroFormField.harAleneomsorg}
                                    legend={getIntroFormLegend(intl, IntroFormField.harAleneomsorg)}
                                    validate={validateYesOrNoIsAnswered}
                                    showStop={avslag === IntroFormAvslag.harIkkeAleneomsorg}
                                    stopMessage={<>Lorem ipsum</>}
                                />
                            </QuestionVisibilityBlock>
                            <QuestionVisibilityBlock fieldName={IntroFormField.mottakerErEktefelleEllerPartner}>
                                <IntroFormQuestion
                                    name={IntroFormField.mottakerErEktefelleEllerPartner}
                                    legend={getIntroFormLegend(intl, IntroFormField.mottakerErEktefelleEllerPartner)}
                                    validate={validateYesOrNoIsAnswered}
                                    showStop={avslag === IntroFormAvslag.mottakerErIkkeEktefelleEllerPartner}
                                    stopMessage={<>Lorem ipsum</>}
                                />
                            </QuestionVisibilityBlock>
                            <QuestionVisibilityBlock fieldName={IntroFormField.mottakersArbeidssituasjonErOk}>
                                <IntroFormQuestion
                                    name={IntroFormField.mottakersArbeidssituasjonErOk}
                                    legend={getIntroFormLegend(intl, IntroFormField.mottakersArbeidssituasjonErOk)}
                                    validate={validateRequiredList}
                                    showStop={avslag === IntroFormAvslag.mottakersArbeidssituasjonErIkkeOk}
                                    stopMessage={<>Lorem ipsum</>}
                                />
                            </QuestionVisibilityBlock>
                        </QuestionVisibilityContext.Provider>
                    </IntroFormComponents.Form>
                );
            }}
        />
    );
};

export default IntroForm;
