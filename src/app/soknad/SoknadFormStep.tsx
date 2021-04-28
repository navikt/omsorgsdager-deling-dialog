import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { UnansweredQuestionsInfo } from '@navikt/sif-common-formik/lib';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import StepSubmitButton from '@navikt/sif-common-soknad/lib/soknad-step/step-submit-button/StepSubmitButton';
import Step from '@navikt/sif-common-soknad/lib/soknad-step/step/Step';
import getFieldErrorHandler from '@navikt/sif-common-formik/lib/validation/fieldErrorHandler';
import { SoknadFormData } from '../types/SoknadFormData';
import { useSoknadContext } from './SoknadContext';
import SoknadFormComponents from './SoknadFormComponents';
import { StepID } from './soknadStepsConfig';
import { isIntlErrorObject } from '@navikt/sif-common-formik/lib/validation/types';

interface OwnProps {
    id: StepID;
    onStepCleanup?: (values: SoknadFormData) => SoknadFormData;
    onSendSoknad?: () => void;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    includeValidationSummary?: boolean;
    buttonDisabled?: boolean;
    stepTitle?: string;
    pageTitle?: string;
    showNotAllQuestionsAnsweredMessage?: boolean;
    children: React.ReactNode;
}

type Props = OwnProps;

const SoknadFormStep: React.FunctionComponent<Props> = ({
    id,
    onStepCleanup,
    onSendSoknad,
    children,
    showButtonSpinner,
    showSubmitButton = true,
    includeValidationSummary = true,
    stepTitle,
    pageTitle,
    showNotAllQuestionsAnsweredMessage,
    buttonDisabled,
}) => {
    const intl = useIntl();
    const { soknadStepsConfig, resetSoknad, gotoNextStepFromStep, continueSoknadLater } = useSoknadContext();
    const stepConfig = soknadStepsConfig[id];
    const texts = soknadStepUtils.getStepTexts(intl, stepConfig);
    const applicationTitle = intlHelper(intl, 'application.title');

    useLogSidevisning(id);

    return (
        <Step
            bannerTitle={applicationTitle}
            cancelOrContinueLaterAriaLabel={intlHelper(intl, 'application.cancelOrContinueLaterLabel')}
            stepTitle={stepTitle || texts.stepTitle}
            pageTitle={pageTitle || texts.pageTitle}
            backLinkHref={stepConfig.backLinkHref}
            steps={soknadStepUtils.getStepIndicatorStepsFromConfig(soknadStepsConfig, intl)}
            activeStepId={id}
            onCancel={resetSoknad}
            onContinueLater={continueSoknadLater ? () => continueSoknadLater(id) : undefined}>
            <SoknadFormComponents.Form
                includeButtons={false}
                includeValidationSummary={includeValidationSummary}
                fieldErrorHandler={getFieldErrorHandler(intl, 'validation')}
                isHandledErrorTypeFunc={isIntlErrorObject}
                noButtonsContentRenderer={
                    showNotAllQuestionsAnsweredMessage
                        ? (): React.ReactNode => (
                              <UnansweredQuestionsInfo>
                                  <FormattedMessage id="page.form.ubesvarteSpørsmålInfo" />
                              </UnansweredQuestionsInfo>
                          )
                        : undefined
                }
                runDelayedFormValidation={true}
                cleanup={onStepCleanup}
                onValidSubmit={onSendSoknad ? onSendSoknad : (): void => gotoNextStepFromStep(id)}>
                {children}
                {showSubmitButton && (
                    <Box textAlignCenter={true} margin="xl">
                        <StepSubmitButton disabled={buttonDisabled} showSpinner={showButtonSpinner}>
                            {texts.nextButtonLabel}
                        </StepSubmitButton>
                    </Box>
                )}
            </SoknadFormComponents.Form>
        </Step>
    );
};

export default SoknadFormStep;
