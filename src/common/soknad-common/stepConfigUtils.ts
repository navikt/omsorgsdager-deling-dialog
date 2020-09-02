import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface StepTexts {
    pageTitle: string;
    stepTitle: string;
    nextButtonLabel: string;
}

export enum SoknadApplicationType {
    'SOKNAD' = 'soknad',
    'MELDING' = 'melding',
}

export interface SoknadSingleStepConfig<STEPS> {
    id: string;
    index: number;
    route: string;
    nextStep?: STEPS;
    nextStepRoute?: string;
    backLinkHref?: string;
    pageTitleIntlKey: string;
    stepTitleIntlKey: string;
    nextButtonLabelIntlKey: string;
}

export interface SoknadStepsConfig<STEPS> {
    [key: string]: SoknadSingleStepConfig<STEPS>;
}

export const getStepTexts = <Step>(intl: IntlShape, stepConfig: SoknadSingleStepConfig<Step>): StepTexts => {
    return {
        pageTitle: intlHelper(intl, stepConfig.pageTitleIntlKey),
        stepTitle: intlHelper(intl, stepConfig.stepTitleIntlKey),
        nextButtonLabel: intlHelper(intl, stepConfig.nextButtonLabelIntlKey),
    };
};

export const getSoknadRootRoute = (applicationType: SoknadApplicationType): string => {
    return `/${applicationType}/`;
};

export const getSoknadStepRoute = <STEPS>(stepId: STEPS, applicationType: SoknadApplicationType): string => {
    return `${getSoknadRootRoute(applicationType)}${stepId}`;
};

export const getSoknadStepsConfig = <STEPS extends string>(
    steps: STEPS[],
    applicationType: SoknadApplicationType
): SoknadStepsConfig<STEPS> => {
    const numSteps = steps.length;
    const config: SoknadStepsConfig<STEPS> = {};
    let idx = 0;
    steps.forEach((stepId) => {
        const nextStep = idx < numSteps - 1 ? steps[idx + 1] : undefined;
        const nextStepRoute = nextStep ? getSoknadStepRoute(nextStep, applicationType) : undefined;
        config[stepId] = {
            id: stepId,
            pageTitleIntlKey: `step.${stepId}.pageTitle`,
            stepTitleIntlKey: `step.${stepId}.stepTitle`,
            nextButtonLabelIntlKey: `step.${stepId}.nextButtonLabel`,
            route: getSoknadStepRoute(stepId, applicationType),
            index: idx,
            backLinkHref: idx > 0 ? getSoknadStepRoute(steps[idx - 1], applicationType) : undefined,
            nextStep,
            nextStepRoute,
        };
        idx++;
    });
    return config;
};
