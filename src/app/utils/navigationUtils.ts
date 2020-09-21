import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import { History } from 'history';
import AppRoutes, { getRouteUrl } from '../config/routeConfig';

const loginUrl = getEnvironmentVariable('LOGIN_URL');

export const relocateToLoginPage = () => window.location.assign(loginUrl);
export const relocateToNavFrontpage = () => window.location.assign('https://www.nav.no/');
export const relocateToSoknad = () => window.location.assign(getRouteUrl(AppRoutes.SOKNAD));
export const relocateToNotOpenPage = () => window.location.assign(getRouteUrl(AppRoutes.NOT_OPEN));
export const relocateToErrorPage = () => window.location.assign(getRouteUrl(AppRoutes.ERROR));

export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToSoknadFrontpage = (history: History) => history.push(AppRoutes.SOKNAD);
export const navigateToErrorPage = (history: History) => history.push(AppRoutes.ERROR);
export const navigateToReceiptPage = (history: History) => history.push(AppRoutes.SOKNAD_SENT);

export const isOnSoknadFrontpage = (location: Location) => location.pathname === getRouteUrl(AppRoutes.SOKNAD);
