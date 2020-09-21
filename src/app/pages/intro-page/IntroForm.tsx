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
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';

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
                                stopMessage={
                                    <>{intlHelper(intl, 'introForm.form.erArbeidstakerSnEllerFrilanser.stopMessage')}</>
                                }
                            />
                            <IntroFormQuestion
                                name={IntroFormField.harAleneomsorg}
                                validate={validateYesOrNoIsAnswered}
                                showStop={avslag === IntroFormAvslag.harIkkeAleneomsorg}
                                stopMessage={<>{intlHelper(intl, 'introForm.form.harAleneomsorg.stopMessage')}</>}
                                description={
                                    <ExpandableInfo title={intlHelper(intl, 'hvaBetyrDette')}>
                                        <p>{intlHelper(intl, 'introForm.form.harAleneomsorg.hvaBetyr.1')}</p>
                                        <p>{intlHelper(intl, 'introForm.form.harAleneomsorg.hvaBetyr.2')}</p>
                                        <Lenke href={getLenker(intl.locale).merOmFastBostedOgSamvær} target="_blank">
                                            {intlHelper(intl, 'introForm.form.harAleneomsorg.hvaBetyr.lenke')}
                                        </Lenke>
                                    </ExpandableInfo>
                                }
                            />
                            <IntroFormQuestion
                                name={IntroFormField.mottakerErIkkeEktefelleEllerSamboer}
                                validate={validateYesOrNoIsAnswered}
                                showStop={avslag === IntroFormAvslag.mottakerErIkkeEktefelleEllerSamboer}
                                stopMessage={
                                    <>
                                        {intlHelper(intl, 'introForm.form.mottakerErEktefelleEllerSamboer.stopMessage')}{' '}
                                        <Lenke href={getLenker(intl.locale).merOmFastBostedOgSamvær} target="_blank">
                                            {intlHelper(
                                                intl,
                                                'introForm.form.mottakerErEktefelleEllerSamboer.stopMessage.lenke'
                                            )}
                                        </Lenke>
                                    </>
                                }
                            />
                            <IntroFormQuestion
                                name={IntroFormField.mottakersArbeidssituasjonErOk}
                                validate={validateRequiredList}
                                showStop={avslag === IntroFormAvslag.mottakersArbeidssituasjonErIkkeOk}
                                stopMessage={<p>{intlHelper(intl, 'introForm.info.væreyrkesaktiv.stopMessage')}</p>}
                            />
                        </QuestionVisibilityContext.Provider>
                    </IntroFormComponents.Form>
                );
            }}
        />
    );
};

export default IntroForm;
