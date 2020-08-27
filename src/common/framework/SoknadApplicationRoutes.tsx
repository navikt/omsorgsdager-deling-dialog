import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import UnavailablePage from '../pages/UnavailablePage';
import UnknownPage from '../pages/UnknownPage';

export enum GlobalSoknadApplicationRoutes {
    start = '/',
    error = '/feil',
    unavailable = '/utilgjengelig',
    unknown = '*',
}

interface Props {
    contentRoutes: React.ReactNode[];
    errorContentRenderer?: () => React.ReactNode;
    unavailableContentRenderer?: () => React.ReactNode;
    unknownContentRenderer?: () => React.ReactNode;
}

const SoknadApplicationRoutes = ({
    contentRoutes,
    errorContentRenderer,
    unavailableContentRenderer,
    unknownContentRenderer,
}: Props) => (
    <Switch>
        {...contentRoutes}
        <Route path={GlobalSoknadApplicationRoutes.error} exact={true}>
            <ErrorPage contentRenderer={errorContentRenderer} />
        </Route>
        <Route path={GlobalSoknadApplicationRoutes.unavailable}>
            <UnavailablePage contentRenderer={unavailableContentRenderer} />
        </Route>
        <Route path={GlobalSoknadApplicationRoutes.unknown}>
            <UnknownPage contentRenderer={unknownContentRenderer} />
        </Route>
    </Switch>
);

export default SoknadApplicationRoutes;
