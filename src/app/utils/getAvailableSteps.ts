import { SoknadStep } from '../soknad/SoknadSteps';

export const getAvailableSteps = (): SoknadStep[] => {
    const steps: SoknadStep[] = [];
    steps.push(SoknadStep.DINE_BARN);
    steps.push(SoknadStep.OM_BARNA);
    steps.push(SoknadStep.ARBEIDSSITUASJON);
    steps.push(SoknadStep.OMSORGSDAGER);
    steps.push(SoknadStep.MOTTAKER);
    steps.push(SoknadStep.MEDLEMSKAP);
    steps.push(SoknadStep.OPPSUMMERING);
    return steps;
};
