import { createContext, useContext } from 'react';
import { SoknadStepsConfig } from '../../common/soknad-common/stepConfigUtils';
import { SoknadApiData } from '../types/SoknadApiData';
import { StepID } from './StepID';
import { SendSoknadStatus2 } from './deleteMe';

export interface SendSoknadStatus {
    sendingInProgress: boolean;
    sendCounter: number;
    showErrorMessage: boolean;
    soknadSent?: boolean;
}

export interface SoknadContext {
    soknadStepsConfig: SoknadStepsConfig<StepID>;
    sendSoknadStatus: SendSoknadStatus2;
    startSoknad: () => void;
    gotoNextStepFromStep: (stepId: StepID) => void;
    sendSoknad: (apiValues: SoknadApiData) => void;
    resetSoknad: () => void;
    continueSoknadLater?: (stepId: StepID) => void;
}

export const SoknadContext = createContext<SoknadContext | undefined>(undefined);

export const useSoknadContext = () => {
    const context = useContext(SoknadContext);
    if (context === undefined) {
        throw new Error('useSoknadContext needs to be called within a SoknadContext');
    }
    return context;
};
