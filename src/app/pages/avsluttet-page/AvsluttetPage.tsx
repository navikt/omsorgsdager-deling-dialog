import * as React from 'react';
import { useIntl } from 'react-intl';
import { useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';

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
                    <p>Fra 1 januar 2023 skal ikke deling av dager meldes fra om til NAV lengere.</p>
                    <p>
                        Du som er alene om omsorgen kan fortsatt dele dager med en ny ektefelle/samboer eller til en
                        samværsforelder, men du skal ikke sende melding om dette til NAV. Du og den du vil dele med
                        avtaler dette dere i mellom og gir beskjed til deres arbeidsgivere om hvor mange dager dere har
                        delt.
                    </p>
                    <p>
                        <Lenke href="https://www.nav.no/omsorgspenger#dele">
                            Her kan du lese mer om deling av omsorgsdager
                        </Lenke>
                        .
                    </p>
                </CounsellorPanel>
            </Box>
        </Page>
    );
};

export default AvsluttetPage;
