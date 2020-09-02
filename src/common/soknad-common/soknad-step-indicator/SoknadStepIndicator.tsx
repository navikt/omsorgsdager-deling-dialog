import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import NAVStepIndicator from 'nav-frontend-stegindikator/lib/stegindikator';
import { default as Step } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { SoknadStepsConfig, SoknadStepConfig } from '../soknadStepConfig';

interface StepIndicatorStep {
    id: string;
    index: number;
    label: string;
}

interface Props {
    activeStep: SoknadStepConfig<string>;
    stepsConfig: SoknadStepsConfig<string>;
}

const getStepsFromConfig = (stepsConfig: SoknadStepsConfig<string>, intl: IntlShape): StepIndicatorStep[] =>
    Object.keys(stepsConfig).map((key) => {
        const stepConfig = stepsConfig[key];
        const step: StepIndicatorStep = {
            id: stepConfig.id,
            index: stepConfig.index,
            label: intlHelper(intl, stepConfig.stepTitleIntlKey),
        };
        return step;
    });

const SoknadStepIndicator = ({ activeStep, stepsConfig }: Props) => {
    const intl = useIntl();
    const steps = getStepsFromConfig(stepsConfig, intl);
    return (
        <NAVStepIndicator visLabel={false} autoResponsiv={false} aktivtSteg={activeStep.index}>
            {steps.map(({ id, index, label }) => {
                return <Step index={index} label={label} key={id} />;
            })}
        </NAVStepIndicator>
    );
};

export default SoknadStepIndicator;
