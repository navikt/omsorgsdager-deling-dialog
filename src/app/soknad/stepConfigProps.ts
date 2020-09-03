import { SoknadStepsConfig } from '../../common/soknad-common/stepConfigUtils';
import { StepID } from './StepID';

export interface StepConfigProps {
    config: SoknadStepsConfig<StepID>;
    onValidSubmit: () => void;
    onResetSoknad: () => void;
}
