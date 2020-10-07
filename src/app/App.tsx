import * as React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router-dom';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import Modal from 'nav-frontend-modal';
import SoknadApplication from '@navikt/sif-common-soknad/lib/soknad-application-setup/SoknadApplication';
import SoknadApplicationCommonRoutes from '@navikt/sif-common-soknad/lib/soknad-application-setup/SoknadApplicationCommonRoutes';
import { applicationIntlMessages } from './i18n/applicationMessages';
import IntroPage from './pages/intro-page/IntroPage';
import SoknadRemoteDataFetcher from './soknad/SoknadRemoteDataFetcher';
import './styles/app.less';

Modal.setAppElement('#app');

const APPLICATION_KEY = 'omsorgsdager-deling';
const root = document.getElementById('app');

const publicPath = getEnvironmentVariable('PUBLIC_PATH');

render(
    <SoknadApplication
        appName="Overføring av omsorgsdager til ny ektefelle eller samboer"
        intlMessages={applicationIntlMessages}
        sentryKey={APPLICATION_KEY}
        appStatus={{
            applicationKey: APPLICATION_KEY,
            sanityConfig: {
                projectId: getEnvironmentVariable('APPSTATUS_PROJECT_ID'),
                dataset: getEnvironmentVariable('APPSTATUS_DATASET'),
            },
        }}
        publicPath={publicPath}>
        <SoknadApplicationCommonRoutes
            contentRoutes={[
                <Route path="/" key="intro" exact={true} component={IntroPage} />,
                <Route path="/melding" key="soknad" component={SoknadRemoteDataFetcher} />,
            ]}
        />
    </SoknadApplication>,
    root
);
