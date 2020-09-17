import { SendSoknadStatus } from './SoknadContext';
import { initial, RemoteData } from '@devexperts/remote-data-ts';
import { SoknadApiData } from '../types/SoknadApiData';

export const initialState: SendSoknadStatus = {
    sendCounter: 0,
    sendingInProgress: false,
    showErrorMessage: false,
    soknadSent: undefined,
};

export const triggerSendState = (previousState: SendSoknadStatus): SendSoknadStatus => ({
    ...previousState,
    soknadSent: false,
    sendingInProgress: true,
});

export const initializeSendState = (prevState: SendSoknadStatus): SendSoknadStatus => ({
    sendingInProgress: true,
    soknadSent: false,
    sendCounter: prevState.sendCounter + 1,
    showErrorMessage: false,
});

export const onSoknadSentState: SendSoknadStatus = {
    sendCounter: 0,
    sendingInProgress: false,
    showErrorMessage: false,
};

export const onServerErrorCounterLessThanThree = (previousState: SendSoknadStatus): SendSoknadStatus => ({
    sendingInProgress: false,
    soknadSent: false,
    sendCounter: previousState.sendCounter + 1,
    showErrorMessage: true,
});

export interface SendSoknadStatus2 {
    failures: number;
    status: RemoteData<Error, SoknadApiData>;
}

export const initialSendSoknadState2: SendSoknadStatus2 = {
    failures: 0,
    status: initial,
};
