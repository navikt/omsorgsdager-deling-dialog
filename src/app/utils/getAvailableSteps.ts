import { SoknadStepID } from '../soknad/SoknadStepIDs';

export const getAvailableSteps = (): SoknadStepID[] => {
    const steps: SoknadStepID[] = [];
    steps.push(SoknadStepID.DINE_BARN);
    steps.push(SoknadStepID.OM_BARNA);
    steps.push(SoknadStepID.ARBEIDSSITUASJON);
    steps.push(SoknadStepID.OMSORGSDAGER);
    steps.push(SoknadStepID.MOTTAKER);
    steps.push(SoknadStepID.OPPSUMMERING);
    return steps;
};
