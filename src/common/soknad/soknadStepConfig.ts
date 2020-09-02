export enum SoknadApplicationType {
    'SOKNAD' = 'soknad',
    'MELDING' = 'melding',
}

export interface SoknadStepConfig<STEPS> {
    id: string;
    index: number;
    nextStep?: STEPS;
    route: string;
    backLinkHref?: string;
    pageTitleIntlKey: string;
    stepTitleIntlKey: string;
    nextButtonLabelIntlKey: string;
}

export interface SoknadStepsConfig<STEPS> {
    [key: string]: SoknadStepConfig<STEPS>;
}

export const getSoknadRootRoute = (applicationType: SoknadApplicationType): string => {
    return `/${applicationType}/`;
};

export const getSoknadRoute = <STEPS>(stepId: STEPS, applicationType: SoknadApplicationType): string => {
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
        config[stepId] = {
            id: stepId,
            pageTitleIntlKey: `step.${stepId}.pageTitle`,
            stepTitleIntlKey: `step.${stepId}.stepTitle`,
            nextButtonLabelIntlKey: `step.${stepId}.nextButtonLabel`,
            route: getSoknadRoute(stepId, applicationType),
            index: idx,
            backLinkHref: idx > 0 ? getSoknadRoute(steps[idx - 1], applicationType) : undefined,
            nextStep: idx < numSteps - 1 ? steps[idx + 1] : undefined,
        };
        idx++;
    });
    return config;
};
