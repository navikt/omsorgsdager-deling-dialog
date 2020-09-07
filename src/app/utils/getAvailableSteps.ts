import { StepID } from '../soknad/StepID';

export const getAvailableSteps = (): StepID[] => {
    const steps: StepID[] = [];
    steps.push(StepID.DINE_BARN);
    steps.push(StepID.OM_BARNA);
    steps.push(StepID.DIN_SITUASJON);
    steps.push(StepID.MOTTAKER);
    steps.push(StepID.OPPSUMMERING);
    return steps;
};
