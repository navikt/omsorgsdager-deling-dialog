import { useEffect, useRef } from 'react';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import amplitude, { AmplitudeClient } from 'amplitude-js';
import constate from 'constate';
import { Søknadstype } from '../types/Soknadstype';
import { APPLICATION_KEY } from '../App';

export enum AmplitudeEvents {
    'sidevisning' = 'sidevisning',
    'applikasjonStartet' = 'applikasjon-startet',
    'skjemaFullført' = 'skjema fullført',
}

interface InnsynUserProperties {
    antallSaker: number;
}

export const [AmplitudeProvider, useAmplitudeInstance] = constate(() => {
    const instance = useRef<AmplitudeClient | undefined>();
    const isActive = getEnvironmentVariable('USE_AMPLITUDE') === 'true';

    useEffect(() => {
        if (amplitude && isActive) {
            instance.current = amplitude.getInstance();
            instance.current.init('default', '', {
                apiEndpoint: 'amplitude.nav.no/collect-auto',
                saveEvents: false,
                includeUtm: true,
                includeReferrer: true,
                platform: window.location.toString(),
            });
        }
    }, [isActive]);

    function logEvent(eventName: string, eventProperties?: any) {
        if (getEnvironmentVariable('APP_VERSION') === 'dev') {
            console.log({ eventName, eventProperties });
        }
        if (instance.current) {
            instance.current.logEvent(eventName, eventProperties);
        }
    }

    function setUserProperties(properties: InnsynUserProperties) {
        if (isActive && instance.current) {
            instance.current.setUserProperties(properties);
        }
    }

    async function logSidevisning(pageKey: string) {
        logEvent(AmplitudeEvents.sidevisning, {
            pageKey,
            team: 'sykdom-i-familien',
        });
    }

    async function logSoknadSent(type: Søknadstype) {
        logEvent(AmplitudeEvents.skjemaFullført, {
            skjemanavn: 'Melding om deling av dager',
            skjemaId: APPLICATION_KEY,
            type,
        });
    }

    return { logEvent, logSidevisning, setUserProperties, logSoknadSent };
});
