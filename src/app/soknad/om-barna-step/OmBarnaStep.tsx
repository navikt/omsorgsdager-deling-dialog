import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';

const OmBarnaStep = ({ onResetSoknad, onValidSubmit, config: soknadStepsConfig }: StepConfigProps) => {
    return (
        <SoknadFormStep
            id={StepID.OM_BARNA}
            config={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}>
            content
        </SoknadFormStep>
    );
};

export default OmBarnaStep;
