import { SoknadApplicationType } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';

export enum StepID {
    'DINE_BARN' = 'dine-barn',
    'OM_BARNA' = 'om-barna',
    'DIN_SITUASJON' = 'din-situasjon',
    'MOTTAKER' = 'mottaker',
    'OPPSUMMERING' = 'oppsummering',
}

const SoknadSteps: StepID[] = [
    StepID.DINE_BARN,
    StepID.OM_BARNA,
    StepID.DIN_SITUASJON,
    StepID.MOTTAKER,
    StepID.OPPSUMMERING,
];

export const soknadStepsConfig = soknadStepUtils.getStepsConfig(SoknadSteps, SoknadApplicationType.MELDING);
