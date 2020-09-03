import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';

const OmsorgsdagerStep = ({ onResetSoknad, onValidSubmit, config: soknadStepsConfig }: StepConfigProps) => {
    return (
        <SoknadFormStep
            id={StepID.OMSORGSDAGER}
            config={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}>
            content
        </SoknadFormStep>
    );
};

export default OmsorgsdagerStep;
