import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import { BarnApiData } from '../../utils/map-form-data-to-api-data/mapBarnToApiData';
import BarnSummaryList from './BarnSummaryList';

interface Props {
    apiValues: BarnApiData;
}

const DineBarnSummary = ({ apiValues: { barn } }: Props) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.dine-barn.header')}>
            <Box margin="l">
                <BarnSummaryList barn={barn} />
            </Box>
        </SummarySection>
    );
};

export default DineBarnSummary;
