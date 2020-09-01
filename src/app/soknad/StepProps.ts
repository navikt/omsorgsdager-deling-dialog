import { SoknadStepConfig } from '../../common/soknad/soknadStepConfig';
import { SoknadStep } from './SoknadSteps';

export interface StepProps {
    stepConfig: SoknadStepConfig<SoknadStep>;
    resetSoknad: () => void;
    onValidSubmit: () => void;
}
