import { SoknadStepsConfig } from '../../common/soknad-common/stepConfigUtils';
import { StepID } from './StepID';

export interface StepConfigProps {
    stepConfig: SoknadStepsConfig<StepID>;
    onValidSubmit: () => void;
    onResetSoknad: () => void;
}
