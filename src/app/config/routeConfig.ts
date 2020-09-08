import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';

enum GlobalRoutes {
    NOT_OPEN = '/utilgjengelig',
    MELDING = '/melding',
    // SOKNAD_ERROR = '/melding/feil',
    SOKNAD_SENT = '/melding/melding-sendt',
    ERROR = '/feil',
}

export const getRouteUrl = (route: GlobalRoutes): string => `${getEnvironmentVariable('PUBLIC_PATH')}${route}`;

export default GlobalRoutes;
