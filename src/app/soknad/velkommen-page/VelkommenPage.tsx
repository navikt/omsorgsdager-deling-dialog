import React from 'react';
import { useIntl } from 'react-intl';
import FrontPageBanner from '@navikt/sif-common-core/lib/components/front-page-banner/FrontPageBanner';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import VelkommenPageForm from './VelkommenPageForm';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    onStartSoknad: () => void;
}

const VelkommenPage = ({ onStartSoknad }: Props) => {
    const intl = useIntl();
    return (
        <Page
            title={intlHelper(intl, 'application.title')}
            topContentRenderer={() => (
                <FrontPageBanner
                    bannerSize="large"
                    counsellorWithSpeechBubbleProps={{
                        strongText: intlHelper(intl, 'step.velkommen.banner.tittel'),
                        normalText: intlHelper(intl, 'step.velkommen.banner.tekst'),
                    }}
                />
            )}>
            <Box margin="xxxl">
                <VelkommenPageForm onStart={onStartSoknad} />
            </Box>
        </Page>
    );
};

export default VelkommenPage;
