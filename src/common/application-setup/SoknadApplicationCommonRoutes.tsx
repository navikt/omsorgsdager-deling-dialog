import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import UnavailablePage from '../pages/UnavailablePage';
import UnknownPage from '../pages/UnknownPage';

export enum GlobalSoknadApplicationRoutes {
    start = '/',
    error = '/feil',
    unavailable = '/utilgjengelig',
    unknownRoute = '*',
}

interface Props {
    contentRoutes: React.ReactNode[];
    errorContentRenderer?: () => React.ReactNode;
    unavailableContentRenderer?: () => React.ReactNode;
    unknownRouteContentRenderer?: () => React.ReactNode;
}

const SoknadApplicationCommonRoutes = ({
    contentRoutes,
    errorContentRenderer,
    unavailableContentRenderer,
    unknownRouteContentRenderer,
}: Props) => (
    <Switch>
        {...contentRoutes}
        <Route path={GlobalSoknadApplicationRoutes.error} exact={true}>
            <ErrorPage contentRenderer={errorContentRenderer} />
        </Route>
        <Route path={GlobalSoknadApplicationRoutes.unavailable}>
            <UnavailablePage contentRenderer={unavailableContentRenderer} />
        </Route>
        <Route path={GlobalSoknadApplicationRoutes.unknownRoute}>
            <UnknownPage contentRenderer={unknownRouteContentRenderer} />
        </Route>
    </Switch>
);

export default SoknadApplicationCommonRoutes;
