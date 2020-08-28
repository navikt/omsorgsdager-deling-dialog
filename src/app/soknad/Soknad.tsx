import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ErrorPage from '../../common/pages/ErrorPage';
import useSoknadEssentials, { CombinedType } from '../hooks/useSoknadEssentials';
import RemoteDataHandler from '../../common/framework/RemoteDataHandler';
import LoadPoster from '../../common/framework/LoadPoster';

const Soknad = () => {
    const soknadEssentials = useSoknadEssentials();
    return (
        <RemoteDataHandler<CombinedType>
            remoteData={soknadEssentials}
            initializing={() => <LoadPoster />}
            loading={() => <LoadPoster />}
            error={(error) => (
                <ErrorPage
                    contentRenderer={() => (
                        <>
                            Det oppstod en feil under henting av informasjon: <pre>{JSON.stringify(error.message)}</pre>
                        </>
                    )}
                />
            )}
            success={([person, mellomlagring]) => {
                console.log(person, mellomlagring);
                return (
                    <div>
                        <h1>Søknad</h1>
                        <Switch>
                            <Route path={'/'}>Velkommen</Route>
                            <Route path="/soknad/barn">Barn</Route>
                            <Route path="/soknad/medlemsskap">Medlemsskap</Route>
                            <Route path="/soknad/oppsummering">Oppsummering</Route>
                            <Route path="/soknad/kvittering">Kvittering</Route>
                        </Switch>
                    </div>
                );
            }}
        />
    );
};

export default Soknad;
