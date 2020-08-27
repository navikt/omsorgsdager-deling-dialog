import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoadWrapper from '../../common/load-wrapper/LoadWrapper';
import ErrorPage from '../../common/pages/ErrorPage';
import useSoknadEssentials from '../hooks/useSoknadEssentials';

const Soknad = () => {
    const { isLoading, userIsUnauthorized, error, soknadEssentials } = useSoknadEssentials();

    return (
        <LoadWrapper
            isLoading={isLoading === true || userIsUnauthorized === true}
            contentRenderer={() => {
                if (error) {
                    return <ErrorPage />;
                }
                if (soknadEssentials) {
                    return (
                        <Switch>
                            <Route path={'/'}>Velkommen</Route>
                            <Route path="/soknad/barn">Barn</Route>
                            <Route path="/soknad/medlemsskap">Medlemsskap</Route>
                            <Route path="/soknad/oppsummering">Oppsummering</Route>
                            <Route path="/soknad/kvittering">Kvittering</Route>
                        </Switch>
                    );
                }
                return <ErrorPage />;
            }}
        />
    );
};

export default Soknad;
