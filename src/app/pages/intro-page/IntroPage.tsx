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

const IntroPage = () => {
    const intl = useIntl();
    const history = useHistory();
    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Box margin="xxxl">
                <InformationPoster>
                    WIP: Her kan du som er alene om omsorgen overføre dager til ny ektefelle eller til en samboer du har
                    bodd med i minst 12 måneder. Du kan overføre så mange dager du har tilgjengelig, men ikke flere enn
                    10. Den du overfører til må kunne bruke dagene. Det betyr at den som skal få dager må være
                    yrkesaktiv. Hvis den du skal overføre til har egne barn i husstanden under.
                </InformationPoster>
            </Box>
            <FormBlock>
                <IntroForm onValidSubmit={() => navigateToSoknadFrontpage(history)} />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
