import { createContext, useContext } from 'react';
import { initial, RemoteData } from '@devexperts/remote-data-ts';
import { SoknadApiData } from '../types/SoknadApiData';
import { StepID } from './soknadStepsConfig';
import { SoknadStepsConfig } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';

export interface SendSoknadStatus {
    failures: number;
    status: RemoteData<Error, SoknadApiData>;
}

export const initialSendSoknadState: SendSoknadStatus = {
    failures: 0,
    status: initial,
};
export interface SoknadContext {
    soknadId: string | undefined;
    soknadStepsConfig: SoknadStepsConfig<StepID>;
    sendSoknadStatus: SendSoknadStatus;
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
