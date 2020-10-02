import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ErrorPage from '../soknad-common-pages/ErrorPage';
import UnavailablePage from '../soknad-common-pages/UnavailablePage';
import UnknownRoutePage from '../soknad-common-pages/UnknownRoutePage';
import SoknadErrorMessages from '../soknad-error-messages/SoknadErrorMessages';

export enum GlobalSoknadApplicationRoutes {
    error = '/feil',
    unavailable = '/utilgjengelig',
    unknownRoute = '*',
}

interface Props {
    contentRoutes: React.ReactNode[];
    errorContentRenderer?: () => JSX.Element;
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
            <ErrorPage
                contentRenderer={
                    errorContentRenderer ? errorContentRenderer : () => <SoknadErrorMessages.GeneralApplicationError />
                }
            />
        </Route>
        <Route path={GlobalSoknadApplicationRoutes.unavailable}>
            <UnavailablePage
                contentRenderer={
                    unavailableContentRenderer
                        ? unavailableContentRenderer
                        : () => <SoknadErrorMessages.ApplicationUnavailable />
                }
            />
        </Route>
        <Route path={GlobalSoknadApplicationRoutes.unknownRoute}>
            <UnknownRoutePage
                contentRenderer={
                    unknownRouteContentRenderer
                        ? unavailableContentRenderer
                        : () => <SoknadErrorMessages.UnknownRoute />
                }
            />
        </Route>
    </Switch>
);

export default SoknadApplicationCommonRoutes;
