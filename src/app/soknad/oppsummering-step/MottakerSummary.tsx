import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FødselsnummerSvar from '@navikt/sif-common-soknad/lib/soknad-summary/FødselsnummerSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import { MottakerApiData } from '../../utils/map-form-data-to-api-data/mapMottakerToApiData';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';

interface Props {
    apiValues: MottakerApiData;
}

const MottakerSummary = ({ apiValues }: Props) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.mottaker.header')}>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.mottaker.type')}>
                {apiValues.mottakerNavn} (<FormattedMessage id={`mottaker.${apiValues.mottakerType}`} />)<br />
                <FormattedMessage id="Fødselsnummer" />: <FødselsnummerSvar fødselsnummer={apiValues.mottakerFnr} />
            </SummaryBlock>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.antallDagerSomSkalOverføres')}>
                <FormattedMessage id={`dager`} values={{ dager: apiValues.antallDagerSomSkalOverføres }} />
            </SummaryBlock>
        </SummarySection>
    );
};

export default MottakerSummary;
