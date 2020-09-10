import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

const KvitteringPage = () => {
    const intl = useIntl();
    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Box margin="xxxl">
                <InformationPoster>Søknad mottatt</InformationPoster>
            </Box>
        </Page>
    );
};

export default KvitteringPage;
