export enum SoknadApplicationType {
    'SOKNAD' = 'soknad',
    'MELDING' = 'melding',
}

export interface SingleStepProps<STEPS> {
    index: number;
    nextStep?: STEPS;
    route: string;
    backLinkHref?: string;
    pageTitle: string;
    stepTitle: string;
    nextButtonLabel: string;
}

export interface SoknadStepsConfig<STEPS> {
    [key: string]: SingleStepProps<STEPS>;
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
            pageTitle: `step.${stepId}.pageTitle`,
            stepTitle: `step.${stepId}.stepTitle`,
            nextButtonLabel: `step.${stepId}.nextButtonLabel`,
            route: getSoknadRoute(stepId, applicationType),
            index: idx,
            backLinkHref: idx > 0 ? getSoknadRoute(steps[idx - 1], applicationType) : undefined,
            nextStep: idx < numSteps - 1 ? steps[idx + 1] : undefined,
        };
        idx++;
    });
    return config;
};

export interface SoknadStepConfigProps<STEPS extends string, PAYLOAD = undefined> {
    payload?: PAYLOAD;
    stepConfig: SoknadStepsConfig<STEPS>;
    resetSoknad: () => void;
    onValidSubmit: () => void;
}
