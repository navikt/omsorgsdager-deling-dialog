import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FrontPageBanner from '@navikt/sif-common-core/lib/components/front-page-banner/FrontPageBanner';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Innholdstittel } from 'nav-frontend-typografi';
// import getLenker from '../../lenker';
import './_ikkeMyndigPage.less';

const IkkeMyndigPage = () => {
    const intl = useIntl();
    return (
        <Page
            className="ikkeMyndigPage"
            title={intlHelper(intl, 'page.ikkeMyndig.sidetittel')}
            topContentRenderer={() => (
                <FrontPageBanner
                    bannerSize="xlarge"
                    counsellorWithSpeechBubbleProps={{
                        strongText: intlHelper(intl, 'page.ikkeMyndig.banner.tittel'),
                        normalText: intlHelper(intl, 'page.ikkeMyndig.banner.tekst'),
                    }}
                />
            )}>
            <Box margin="xxxl">
                <Innholdstittel>
                    <FormattedMessage id="page.ikkeMyndig.tittel" />
                </Innholdstittel>
            </Box>
        </Page>
    );
};

export default IkkeMyndigPage;
