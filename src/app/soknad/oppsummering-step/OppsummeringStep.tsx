import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';

const OppsummeringStep = ({ onResetSoknad, onValidSubmit, stepConfig: soknadStepsConfig }: StepConfigProps) => {
    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            stepConfig={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}>
            content
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
