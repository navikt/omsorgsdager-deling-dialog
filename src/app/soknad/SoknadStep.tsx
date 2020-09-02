import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { Knapp } from 'nav-frontend-knapper';
import { SoknadStepsConfig } from '../../common/soknad/soknadStepConfig';
import Step from '../../common/soknad/step/Step';
import { getStepTexts } from '../../common/soknad/stepUtils';
import { SoknadFormData } from '../types/SoknadFormData';
import SoknadFormComponents from './SoknadFormComponents';
import { SoknadStepID } from './SoknadStepIDs';

export interface SoknadStepProps {
    stepId: SoknadStepID;
    soknadStepsConfig: SoknadStepsConfig<SoknadStepID>;
    onValidSubmit: () => void;
    onResetSoknad: () => void;
    onStepCleanup?: (values: SoknadFormData) => SoknadFormData;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
    buttonDisabled?: boolean;
    skipValidation?: boolean;
}

type Props = SoknadStepProps & {
    children: React.ReactNode;
};

const SoknadStep: React.FunctionComponent<Props> = ({
    stepId,
    soknadStepsConfig,
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

    const stepConfig = soknadStepsConfig[stepId];
    const intl = useIntl();
    const texts = getStepTexts(intl, stepConfig);

    return (
        <Step
            stepId={stepId}
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
                        <Knapp
                            type="hoved"
                            htmlType="submit"
                            className={'step__button'}
                            spinner={showButtonSpinner || false}
                            disabled={buttonDisabled || false}>
                            {texts.nextButtonLabel}
                        </Knapp>
                    </FormBlock>
                )}
            </SoknadFormComponents.Form>
        </Step>
    );
};

export default SoknadStep;
