import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import {
    isSøknadFordeling,
    isSøknadKoronaoverføring,
    isSøknadOverføring,
    SoknadApiData,
} from '../../types/SoknadApiData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    apiValues: SoknadApiData;
}

const SøknadstypeSummary = ({ apiValues }: Props) => {
    const intl = useIntl();

    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.søknadstype.header')}>
            <Box margin="l">
                {isSøknadOverføring(apiValues) && (
                    <FormattedMessage
                        id={`step.oppsummering.søknadstype.${apiValues.type}.${apiValues.overføring.mottakerType}`}
                    />
                )}
                {isSøknadFordeling(apiValues) && (
                    <FormattedMessage id={`step.oppsummering.søknadstype.${apiValues.type}`} />
                )}
                {isSøknadKoronaoverføring(apiValues) && (
                    <FormattedMessage id={`step.oppsummering.søknadstype.${apiValues.type}`} />
                )}
            </Box>
        </SummarySection>
    );
};

export default SøknadstypeSummary;
