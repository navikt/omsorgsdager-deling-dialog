import { SoknadStepsConfig } from '../../common/soknad-common/stepConfigUtils';
import { StepID } from './StepID';

export interface StepConfigProps {
    soknadStepsConfig: SoknadStepsConfig<StepID>;
    onValidSubmit: () => void;
    onResetSoknad: () => void;
    onContinueLater?: (stepId: StepID) => void;
}

export const SoknadSteps: StepID[] = [
    StepID.DINE_BARN,
    StepID.OM_BARNA,
    StepID.DIN_SITUASJON,
    StepID.MOTTAKER,
    StepID.OPPSUMMERING,
];
