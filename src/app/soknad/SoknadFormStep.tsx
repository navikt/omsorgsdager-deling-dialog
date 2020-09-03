import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import SoknadCommonStep, {
    SoknadStepCommonProps,
} from '../../common/soknad-common/soknad-common-step/SoknadCommonStep';
import StepSubmitButton from '../../common/soknad-common/step-submit-button/StepSubmitButton';
import { getStepTexts } from '../../common/soknad-common/stepConfigUtils';
import { SoknadFormData } from '../types/SoknadFormData';
import SoknadFormComponents from './SoknadFormComponents';
import { StepConfigProps } from './stepConfigProps';
import { StepID } from './StepID';

interface OwnProps {
    onStepCleanup?: (values: SoknadFormData) => SoknadFormData;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    children: React.ReactNode;
}

type Props = OwnProps & StepConfigProps & SoknadStepCommonProps<StepID>;

const SoknadFormStep: React.FunctionComponent<Props> = ({
    id,
    config: soknadStepsConfig,
    onResetSoknad,
    onStepCleanup,
    onValidSubmit,
    children,
    showButtonSpinner,
    showSubmitButton = true,
    buttonDisabled,
}: Props) => {
    const handleAvbrytOgSlettSøknad = () => {
        onResetSoknad();
    };

    const handleAvbrytOgFortsettSenere = () => {
        onResetSoknad();
    };

    const stepConfig = soknadStepsConfig[id];
    const intl = useIntl();
    const texts = getStepTexts(intl, stepConfig);

    return (
        <SoknadCommonStep
            id={id}
            allSteps={soknadStepsConfig}
            onCancel={handleAvbrytOgSlettSøknad}
            onContinueLater={handleAvbrytOgFortsettSenere}>
            <SoknadFormComponents.Form
                onValidSubmit={onValidSubmit}
                includeButtons={false}
                includeValidationSummary={true}
                runDelayedFormValidation={true}
                cleanup={onStepCleanup}
                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                {children}
                {showSubmitButton && (
                    <FormBlock>
                        <StepSubmitButton disabled={buttonDisabled} showSpinner={showButtonSpinner}>
                            {texts.nextButtonLabel}
                        </StepSubmitButton>
                    </FormBlock>
                )}
            </SoknadFormComponents.Form>
        </SoknadCommonStep>
    );
};

export default SoknadFormStep;
