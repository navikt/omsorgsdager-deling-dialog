import { StepID } from '../soknad/StepID';
import { SoknadFormData } from '../types/SoknadFormData';

const dineBarnIsValid = (values: Partial<SoknadFormData>): boolean => {
    return true;
};

const omBarnaIsValid = (values: Partial<SoknadFormData>): boolean => {
    return true;
};

const dinSituasjonIsValid = (values: Partial<SoknadFormData>): boolean => {
    return true;
};

const mottakerIsValid = (values: Partial<SoknadFormData>): boolean => {
    return true;
};

export const getAvailableSteps = (values: Partial<SoknadFormData>): StepID[] => {
    const steps: StepID[] = [];
    steps.push(StepID.DINE_BARN);
    if (dineBarnIsValid(values)) {
        steps.push(StepID.OM_BARNA);
    }
    if (omBarnaIsValid(values)) {
        steps.push(StepID.DIN_SITUASJON);
    }
    if (dinSituasjonIsValid(values)) {
        steps.push(StepID.MOTTAKER);
    }
    if (mottakerIsValid(values)) {
        steps.push(StepID.OPPSUMMERING);
    }
    return steps;
};
