import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import { navigateToSoknadFrontpage } from '../../utils/navigationUtils';
import IntroForm from './IntroForm';

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
                    <ul>
                        <li>{intlHelper(intl, 'introForm.info.1.list.ektefelle')}</li>
                        <li>{intlHelper(intl, 'introForm.info.1.list.samboer')}</li>
                    </ul>
                    <Lenke href={getLenker(intl.locale).meldingOmDelingAvOmsorgsdager} target="_blank">
                        {intlHelper(intl, 'introForm.info.1.list.lenke.andreForelderen')}
                    </Lenke>
                    <p>{intlHelper(intl, 'introForm.info.2')}</p>
                    <ul>
                        <li>{intlHelper(intl, 'introForm.info.væreyrkesaktiv')}</li>
                        <li>{intlHelper(intl, 'introForm.info.ikkeFylt70')}</li>
                    </ul>
                    <p>
                        {`${intlHelper(intl, 'introForm.info.3')} `}
                        <Lenke href={getLenker(intl.locale).meldingOmDelingAvOmsorgsdager} target="_blank">
                            {intlHelper(intl, 'introForm.info.3.lenkeStopOrdningen')}
                        </Lenke>
                    </p>
                    <p>{intlHelper(intl, 'introForm.info.4')}</p>
                </InformationPoster>
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
