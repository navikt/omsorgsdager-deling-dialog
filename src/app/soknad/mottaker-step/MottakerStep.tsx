import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';

const MottakerStep = ({ onResetSoknad, onValidSubmit, config: soknadStepsConfig }: StepConfigProps) => {
    return (
        <SoknadFormStep
            id={StepID.MOTTAKER}
            config={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}>
            content
        </SoknadFormStep>
    );
};

export default MottakerStep;
