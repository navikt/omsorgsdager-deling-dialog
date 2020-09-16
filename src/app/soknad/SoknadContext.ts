import { createContext, useContext } from 'react';
import { SoknadStepsConfig } from '../../common/soknad-common/stepConfigUtils';
import { SoknadApiData } from '../types/SoknadApiData';
import { StepID } from './StepID';

export interface SendSoknadStatus {
    sendingInProgress: boolean;
    sendCounter: number;
    showErrorMessage: boolean;
    soknadSent?: boolean;
}

export interface SoknadContext {
    soknadStepsConfig: SoknadStepsConfig<StepID>;
    sendSoknadStatus: SendSoknadStatus;
    onStartSoknad: () => void;
    onResetSoknad: () => void;
    onSendSoknad: (apiValues: SoknadApiData) => void;
    onSoknadSent: () => void;
    onContinue: (stepId: StepID) => void;
    onContinueLater?: (stepId: StepID) => void;
}

export const SoknadContext = createContext<SoknadContext | undefined>(undefined);

export const useSoknadContext = () => {
    const context = useContext(SoknadContext);
    if (context === undefined) {
        throw new Error('useStartSoknad needs to be called within a SoknadContext');
    }
    return context;
};
