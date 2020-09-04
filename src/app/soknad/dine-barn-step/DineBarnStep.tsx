import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';
import { Barn } from '../../types/SoknadFormData';

interface OwnProps {
    barn: Barn[];
}

type Props = OwnProps & StepConfigProps;

const DineBarnStep = ({ barn, onResetSoknad, onValidSubmit, soknadStepsConfig: soknadStepsConfig }: Props) => {
    console.log(barn);
    return (
        <SoknadFormStep
            id={StepID.DINE_BARN}
            soknadStepsConfig={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}>
            Dine barn
        </SoknadFormStep>
    );
};

export default DineBarnStep;
