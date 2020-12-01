import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FødselsnummerSvar from '@navikt/sif-common-soknad/lib/soknad-summary/FødselsnummerSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import {
    SoknadApiData,
    isSøknadFordeling,
    isSøknadOverføring,
    isSøknadKoronaoverføring,
} from '../../types/SoknadApiData';

interface Props {
    apiValues: SoknadApiData;
}

const MottakerSummary = ({ apiValues }: Props) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.mottaker.header')}>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.mottaker.type')}>
                {apiValues.mottakerNavn}
                {(isSøknadFordeling(apiValues) || isSøknadOverføring(apiValues)) && (
                    <FormattedMessage id={`mottaker.${apiValues.mottakerType}`} />
                )}
                <br />
                <FormattedMessage id="Fødselsnummer" />: <FødselsnummerSvar fødselsnummer={apiValues.mottakerFnr} />
            </SummaryBlock>
            {(isSøknadOverføring(apiValues) || isSøknadKoronaoverføring(apiValues)) && (
                <SummaryBlock header={intlHelper(intl, 'step.oppsummering.antallDagerSomSkalOverføres')}>
                    <FormattedMessage id={`dager`} values={{ dager: apiValues.antallDagerSomSkalOverføres }} />
                </SummaryBlock>
            )}
        </SummarySection>
    );
};

export default MottakerSummary;
