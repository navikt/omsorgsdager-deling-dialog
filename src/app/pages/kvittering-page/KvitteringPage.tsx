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
                tittel="Søknad mottatt"
                liste={{ tittel: 'Hva skjer nå?', punkter: ['Det vet bare lillegutt'] }}>
                <p>Her kan det komme mer innhold</p>
            </Kvittering>
        </Page>
    );
};

export default KvitteringPage;
