import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FødselsnummerSvar from '@navikt/sif-common-soknad/lib/soknad-summary/FødselsnummerSvar';
import SummaryBlock from '@navikt/sif-common-soknad/lib/soknad-summary/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { prettifyApiDate } from '@navikt/sif-common-soknad/lib/soknad-summary/DatoSvar';
import {
    isSøknadFordeling,
    isSøknadKoronaoverføring,
    isSøknadOverføring,
    SoknadApiData,
} from '../../types/SoknadApiData';
import { isDateBefore2021 } from '../../utils/dateUtils';

interface Props {
    apiValues: SoknadApiData;
}

const MottakerSummary = ({ apiValues }: Props) => {
    const intl = useIntl();

    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.mottaker.header')}>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.mottaker.type')}>
                <FormattedMessage id="step.oppsummering.mottaker.navn" />
                {apiValues.mottakerNavn}
                {isSøknadOverføring(apiValues) && (
                    <>
                        {' '}
                        (<FormattedMessage id={`mottaker.${apiValues.overføring.mottakerType}`} />)
                    </>
                )}
                {isSøknadFordeling(apiValues) && (
                    <>
                        {' '}
                        (<FormattedMessage id={`mottaker.${apiValues.fordeling.mottakerType}`} />)
                    </>
                )}
                <br />
                <FormattedMessage id="Fødselsnummer" />: <FødselsnummerSvar fødselsnummer={apiValues.mottakerFnr} />
            </SummaryBlock>
            {(isSøknadOverføring(apiValues) || isSøknadKoronaoverføring(apiValues)) && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'step.oppsummering.antallDagerSomSkalOverføres')}>
                        <FormattedMessage
                            id={`dager`}
                            values={{
                                dager: isSøknadOverføring(apiValues)
                                    ? apiValues.overføring.antallDagerSomSkalOverføres
                                    : apiValues.korona.antallDagerSomSkalOverføres,
                            }}
                        />
                    </SummaryBlock>
                    {isDateBefore2021() && isSøknadKoronaoverføring(apiValues) && (
                        <SummaryBlock header={intlHelper(intl, 'step.oppsummering.korona.periode.tittel')}>
                            <FormattedMessage
                                id="step.oppsummering.korona.periode.verdi"
                                values={{
                                    fraDato: prettifyApiDate(apiValues.korona.stengingsperiode.fraOgMed),
                                    tilDato: prettifyApiDate(apiValues.korona.stengingsperiode.tilOgMed),
                                }}
                            />
                        </SummaryBlock>
                    )}
                </>
            )}
        </SummarySection>
    );
};

export default MottakerSummary;
