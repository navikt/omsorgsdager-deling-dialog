import { SoknadStepProps } from '../../common/soknad/soknadStepConfig';

export enum StepID {
    'DINE_BARN' = 'dine-barn',
    'OM_BARNA' = 'om-barna',
    'ARBEIDSSITUASJON' = 'arbeidssituasjon',
    'OMSORGSDAGER' = 'omsorgsdager',
    'MOTTAKER' = 'mottaker',
    'MEDLEMSKAP' = 'medlemskap',
    'OPPSUMMERING' = 'oppsummering',
}

export type StepProps = SoknadStepProps<StepID>;

export const getAvailableSteps = (): StepID[] => {
    const steps: StepID[] = [];
    steps.push(StepID.DINE_BARN);
    steps.push(StepID.OM_BARNA);
    steps.push(StepID.ARBEIDSSITUASJON);
    steps.push(StepID.OMSORGSDAGER);
    steps.push(StepID.MOTTAKER);
    steps.push(StepID.MEDLEMSKAP);
    steps.push(StepID.OPPSUMMERING);
    return steps;
};
