import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import StepSubmitButton from '@navikt/sif-common-soknad/lib/soknad-step/step-submit-button/StepSubmitButton';
import Step from '@navikt/sif-common-soknad/lib/soknad-step/step/Step';
import { SoknadFormData } from '../types/SoknadFormData';
import { useSoknadContext } from './SoknadContext';
import SoknadFormComponents from './SoknadFormComponents';
import { StepID } from './soknadStepsConfig';

interface OwnProps {
    id: StepID;
    onStepCleanup?: (values: SoknadFormData) => SoknadFormData;
    onSendSoknad?: () => void;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    includeValidationSummary?: boolean;
    buttonDisabled?: boolean;
    children: React.ReactNode;
}

type Props = OwnProps;

const SoknadFormStep = ({
    id,
    onStepCleanup,
    onSendSoknad,
    children,
    showButtonSpinner,
    showSubmitButton = true,
    includeValidationSummary = true,
    buttonDisabled,
}: Props) => {
    const intl = useIntl();
    const { soknadStepsConfig, resetSoknad, gotoNextStepFromStep, continueSoknadLater } = useSoknadContext();
    const stepConfig = soknadStepsConfig[id];
    const texts = soknadStepUtils.getStepTexts(intl, stepConfig);

    return (
        <Step
            bannerTitle={intlHelper(intl, 'application.title')}
            stepTitle={texts.stepTitle}
            pageTitle={texts.pageTitle}
            backLinkHref={stepConfig.backLinkHref}
            steps={soknadStepUtils.getStepIndicatorStepsFromConfig(soknadStepsConfig, intl)}
            activeStepId={id}
            onCancel={resetSoknad}
            onContinueLater={continueSoknadLater ? () => continueSoknadLater(id) : undefined}>
            <SoknadFormComponents.Form
                includeButtons={false}
                includeValidationSummary={includeValidationSummary}
                runDelayedFormValidation={true}
                cleanup={onStepCleanup}
                onValidSubmit={onSendSoknad ? onSendSoknad : () => gotoNextStepFromStep(id)}
                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
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
