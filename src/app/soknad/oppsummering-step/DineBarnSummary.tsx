import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SummaryBlock from '../../../common/summary/summary-block/SummaryBlock';
import { DineBarnApiData } from '../../utils/map-form-data-to-api-data/mapDineBarnToApiData';
import SummarySection from '../../../common/summary/summary-section/SummarySection';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { Barn } from 'app/types/SoknadFormData';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';

interface Props {
    apiValues: DineBarnApiData;
    barn: Barn[];
}

const DineBarnSummary = ({ apiValues, barn }: Props) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.dine-barn.header')}>
            {barn.length > 0 && (
                <SummaryBlock header={intlHelper(intl, 'step.oppsummering.dine-barn.listHeader.registrerteBarn')}>
                    <SummaryList
                        items={barn}
                        itemRenderer={(barn) =>
                            `${intlHelper(intl, 'step.oppsummering.dine-barn.født')} ${barn.fødselsdato} ${formatName(
                                barn.fornavn,
                                barn.etternavn
                            )}`
                        }
                    />
                </SummaryBlock>
            )}
            {apiValues.andreBarn !== undefined && (
                <SummaryBlock header={intlHelper(intl, 'step.oppsummering.dine-barn.listHeader.andreBarn')}>
                    <SummaryList
                        items={apiValues.andreBarn}
                        itemRenderer={(andreBarn) =>
                            `${intlHelper(intl, 'step.oppsummering.dine-barn.født')} ${andreBarn.fødselsdato} ${
                                andreBarn.navn
                            }`
                        }
                    />
                </SummaryBlock>
            )}
        </SummarySection>
    );
};

export default DineBarnSummary;
