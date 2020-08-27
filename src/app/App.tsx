import * as React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router-dom';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import Modal from 'nav-frontend-modal';
import SoknadApplication from '../common/SoknadApplication';
import SoknadApplicationRoutes from '../common/SoknadApplicationRoutes';
import { applicationIntlMessages } from './i18n/applicationMessages';
import IntroPage from './intro/IntroPage';
import Soknad from './soknad/Soknad';

Modal.setAppElement('#app');

const APPLICATION_KEY = 'pleiepengesoknad';
const root = document.getElementById('app');

render(
    <SoknadApplication
        title="Pleiepengesøknad"
        intlMessages={applicationIntlMessages}
        sentryKey={APPLICATION_KEY}
        appStatus={{
            applicationKey: APPLICATION_KEY,
            sanityConfig: {
                projectId: getEnvironmentVariable('APPSTATUS_PROJECT_ID'),
                dataset: getEnvironmentVariable('APPSTATUS_DATASET'),
            },
        }}>
        <SoknadApplicationRoutes
            contentRoutes={[
                <Route path="/" key="intro" exact={true} component={IntroPage} />,
                <Route path="/soknad" key="soknad" component={Soknad} />,
            ]}
        />
    </SoknadApplication>,
    root
);
