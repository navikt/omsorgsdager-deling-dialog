import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { navigateToSoknadFrontpage } from '../../utils/navigationUtils';
import IntroForm from './IntroForm';

const IntroPage = () => {
    const intl = useIntl();
    const history = useHistory();
    return (
        <Page
            title={intlHelper(intl, 'application.title')}
            topContentRenderer={() => <StepBanner tag="h1" text={intlHelper(intl, 'application.title')} />}>
            <Box margin="xxxl">
                <section aria-label="Introduksjon">
                    <InformationPoster>
                        {intlHelper(intl, 'introForm.info.1')}
                        <p>{intlHelper(intl, 'introForm.info.2')}</p>
                        <p>{intlHelper(intl, 'introForm.info.3')}</p>
                        <p>{intlHelper(intl, 'introForm.info.4')}</p>
                        <p>{intlHelper(intl, 'introForm.info.5')}</p>
                    </InformationPoster>
                </section>
            </Box>
            <FormBlock>
                <IntroForm
                    onValidSubmit={() => {
                        setTimeout(() => {
                            navigateToSoknadFrontpage(history);
                        });
                    }}
                />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
