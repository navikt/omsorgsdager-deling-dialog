import React from 'react';
import { useIntl } from 'react-intl';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ApiBarn } from '../../types/SoknadApiData';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';

interface Props {
    barn: ApiBarn[];
}

const BarnSummaryList = ({ barn }: Props) => {
    const intl = useIntl();
    return (
        <SummaryList
            items={barn}
            itemRenderer={({ identitetsnummer, fødselsdato, navn }: ApiBarn) => {
                const fnr = identitetsnummer ? ` (fnr. ${identitetsnummer})` : '';
                return `${intlHelper(intl, 'step.oppsummering.dine-barn.født')} ${prettifyDate(
                    apiStringDateToDate(fødselsdato)
                )} – ${navn}${fnr}`;
            }}
        />
    );
};

export default BarnSummaryList;
