import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';

interface Props {
    pageTitle?: string;
    bannerTitle?: string;
    contentRenderer?: () => React.ReactNode;
}
const ErrorPage = ({ contentRenderer, pageTitle, bannerTitle }: Props) => {
    const intl = useIntl();
    return (
        <Page
            title={pageTitle || intlHelper(intl, 'page.error.pageTitle')}
            topContentRenderer={bannerTitle ? () => <StepBanner text={bannerTitle} /> : undefined}>
            <Box margin="xxxl">{contentRenderer ? contentRenderer() : <>Feilside</>}</Box>
        </Page>
    );
};

export default ErrorPage;
