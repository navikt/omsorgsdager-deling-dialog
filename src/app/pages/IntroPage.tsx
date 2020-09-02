import React from 'react';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

const IntroPage = () => {
    const intl = useIntl();
    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Box margin="xxxl">
                <InformationPoster>Melding</InformationPoster>
            </Box>
        </Page>
    );
};

export default IntroPage;
