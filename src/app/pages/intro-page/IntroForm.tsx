import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { QuestionVisibilityContext } from '../../../common/context/QuestionVisibilityContext';
import { navigateToSoknadFrontpage } from '../../utils/navigationUtils';
import {
    getIntroFormAvslag,
    IntroFormAvslag,
    IntroFormData,
    IntroFormField,
    introFormInitialValues,
    IntroFormQuestions,
} from './introFormConfig';
import IntroFormQuestion from './IntroFormQuestion';

interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData>();

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
                const kanFortsette = visibility.areAllQuestionsAnswered() && avslag === undefined;
                return (
                    <IntroFormComponents.Form
                        includeValidationSummary={true}
                        includeButtons={kanFortsette}
                        onValidSubmit={() => {
                            navigateToSoknadFrontpage(history);
                        }}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel={intlHelper(intl, 'introForm.start')}>
                        <QuestionVisibilityContext.Provider value={{ visibility }}>
                            <IntroFormQuestion
                                name={IntroFormField.erArbeidstakerSnEllerFrilanser}
                                validate={validateYesOrNoIsAnswered}
                                showStop={avslag === IntroFormAvslag.erIkkeArbeidstakerSnEllerFrilanser}
                                stopMessage={<>Lorem ipsum</>}
                            />
                            <IntroFormQuestion
                                name={IntroFormField.harAleneomsorg}
                                validate={validateYesOrNoIsAnswered}
                                showStop={avslag === IntroFormAvslag.harIkkeAleneomsorg}
                                stopMessage={<>Lorem ipsum</>}
                            />
                            <IntroFormQuestion
                                name={IntroFormField.mottakerErEktefelleEllerPartner}
                                validate={validateYesOrNoIsAnswered}
                                showStop={avslag === IntroFormAvslag.mottakerErIkkeEktefelleEllerPartner}
                                stopMessage={<>Lorem ipsum</>}
                            />
                            <IntroFormQuestion
                                name={IntroFormField.mottakersArbeidssituasjonErOk}
                                validate={validateRequiredList}
                                showStop={avslag === IntroFormAvslag.mottakersArbeidssituasjonErIkkeOk}
                                stopMessage={<>Lorem ipsum</>}
                            />
                        </QuestionVisibilityContext.Provider>
                    </IntroFormComponents.Form>
                );
            }}
        />
    );
};

export default IntroForm;
