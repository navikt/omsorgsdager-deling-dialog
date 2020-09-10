import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import { History } from 'history';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import GlobalRoutes from '../config/routeConfig';

const loginUrl = getEnvironmentVariable('LOGIN_URL');

export const relocateToLoginPage = () => window.location.assign(loginUrl);
export const relocateToNavFrontpage = () => window.location.assign('https://www.nav.no/');
export const relocateToSoknad = () => window.location.assign(getRouteUrl(routeConfig.MELDING));
export const relocateToNotOpenPage = () => window.location.assign(getRouteUrl(routeConfig.NOT_OPEN));
export const relocateToErrorPage = () => window.location.assign(getRouteUrl(routeConfig.ERROR));

export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToSoknadFrontpage = (history: History) => history.push(GlobalRoutes.MELDING);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR);
export const navigateToReceiptPage = (history: History) => history.push(GlobalRoutes.MELDING_SENT);

export const isOnSoknadFrontpage = (location: Location) => location.pathname === getRouteUrl(routeConfig.MELDING);
