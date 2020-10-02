import React from 'react';
import { useIntl } from 'react-intl';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Kvittering from '../../../common/kvittering/Kvittering';

const KvitteringPage = () => {
    const intl = useIntl();
    return (
        <Page title={intlHelper(intl, 'application.title')}>
            <Kvittering
                tittel={intlHelper(intl, 'kvittering.tittel')}
                liste={{
                    tittel: intlHelper(intl, 'kvittering.info.tittel'),
                    punkter: [
                        intlHelper(intl, 'kvittering.info.1'),
                        intlHelper(intl, 'kvittering.info.2'),
                        intlHelper(intl, 'kvittering.info.3'),
                    ],
                }}></Kvittering>
        </Page>
    );
};

export default KvitteringPage;
