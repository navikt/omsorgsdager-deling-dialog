import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';

const DineBarnStep = ({ onResetSoknad, onValidSubmit, config: soknadStepsConfig }: StepConfigProps) => {
    return (
        <SoknadFormStep
            id={StepID.DINE_BARN}
            config={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}>
            Dine barn
        </SoknadFormStep>
    );
};

export default DineBarnStep;
