import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';
import { useFormikContext } from 'formik';
import { SoknadFormData } from '../../types/SoknadFormData';
import { mapFormDataToApiData } from '../../utils/mapFormDataToApiData';

const OppsummeringStep = ({ onResetSoknad, onValidSubmit, soknadStepsConfig }: StepConfigProps) => {
    const { values } = useFormikContext<SoknadFormData>();
    const apiData = mapFormDataToApiData(values);
    console.log(apiData);
    return (
        <SoknadFormStep
            id={StepID.OPPSUMMERING}
            soknadStepsConfig={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}>
            content
        </SoknadFormStep>
    );
};

export default OppsummeringStep;
