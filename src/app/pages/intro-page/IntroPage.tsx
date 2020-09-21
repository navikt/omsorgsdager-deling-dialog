import React from 'react';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import IntroForm from './IntroForm';
import { navigateToSoknadFrontpage } from '../../utils/navigationUtils';
import { useHistory } from 'react-router-dom';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';

const IntroPage = () => {
    const intl = useIntl();
    const history = useHistory();
    return (
        <Page
            title={intlHelper(intl, 'application.title')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'application.title')} />}>
            <Box margin="xxxl">
                <InformationPoster>
                    <p>{intlHelper(intl, 'introForm.info.1')}</p>
                    <p>{intlHelper(intl, 'introForm.info.2')}</p>
                    <ul>
                        <li>{intlHelper(intl, 'introForm.info.væreyrkesaktiv')}</li>
                        <li>{intlHelper(intl, 'introForm.info.haBarnUnder12')}</li>
                        <li>{intlHelper(intl, 'introForm.info.ikkeFylt70')}</li>
                    </ul>
                    <p>{intlHelper(intl, 'introForm.info.3')}</p>
                    <p>{intlHelper(intl, 'introForm.info.4')}</p>
                </InformationPoster>
            </Box>

            <FormBlock>
                <IntroForm onValidSubmit={() => navigateToSoknadFrontpage(history)} />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
