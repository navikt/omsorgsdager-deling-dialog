import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import StepSubmitButton from '../../common/soknad-common/step-submit-button/StepSubmitButton';
import Step from '../../common/soknad-common/step/Step';
import { getStepsFromConfig, getStepTexts } from '../../common/soknad-common/stepConfigUtils';
import { SoknadFormData } from '../types/SoknadFormData';
import SoknadFormComponents from './SoknadFormComponents';
import { StepConfigProps } from './stepConfigProps';
import { StepID } from './StepID';

interface OwnProps {
    id: StepID;
    onStepCleanup?: (values: SoknadFormData) => SoknadFormData;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    includeValidationSummary?: boolean;
    buttonDisabled?: boolean;
    children: React.ReactNode;
}

type Props = OwnProps & StepConfigProps;

const SoknadFormStep: React.FunctionComponent<Props> = ({
    id,
    soknadStepsConfig: allStepsConfig,
    onResetSoknad,
    onStepCleanup,
    onValidSubmit,
    children,
    showButtonSpinner,
    showSubmitButton = true,
    includeValidationSummary = true,
    buttonDisabled,
}: Props) => {
    const handleAvbrytOgSlettSøknad = () => {
        onResetSoknad();
    };

    // const handleAvbrytOgFortsettSenere = () => {
    //     onResetSoknad();
    // };

    const stepConfig = allStepsConfig[id];
    const intl = useIntl();
    const texts = getStepTexts(intl, stepConfig);
    return (
        <Step
            bannerTitle={intlHelper(intl, 'application.title')}
            stepTitle={texts.stepTitle}
            pageTitle={texts.pageTitle}
            backLinkHref={stepConfig.backLinkHref}
            steps={getStepsFromConfig(allStepsConfig, intl)}
            activeStepId={id}
            onCancel={handleAvbrytOgSlettSøknad}>
            <SoknadFormComponents.Form
                onValidSubmit={onValidSubmit}
                includeButtons={false}
                includeValidationSummary={includeValidationSummary}
                runDelayedFormValidation={true}
                cleanup={onStepCleanup}
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
