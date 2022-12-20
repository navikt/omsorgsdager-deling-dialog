import * as React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

const AvsluttetPage = () => {
    const intl = useIntl();
    useLogSidevisning('avsluttet');
    return (
        <Page
            className="ikkeTilgangPage"
            title={intlHelper(intl, 'application.title')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'application.title')} />}>
            <Box margin="xxxl">
                <CounsellorPanel>
                    <p>
                        Nytt fra 1. januar 2023 er at du ikke lenger skal melde fra til NAV når du skal dele
                        omsorgsdagene dine med en samværsforelder, eller en ny ektefelle/samboer.
                    </p>
                    <p>
                        Du, og den du deler omsorgsdager med, må gi beskjed til arbeidsgiverne deres om antall dager
                        dere har gitt og fått.
                    </p>
                </CounsellorPanel>
            </Box>
        </Page>
    );
};

export default AvsluttetPage;
