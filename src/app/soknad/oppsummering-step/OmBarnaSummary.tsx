import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import JaNeiSvar from '../../../common/summary/JaNeiSvar';
import SummaryBlock from '../../../common/summary/summary-block/SummaryBlock';
import { OmBarnaApiData } from '../../utils/map-form-data-to-api-data/mapOmBarnaToApiData';
import SummarySection from '../../../common/summary/summary-section/SummarySection';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { prettifyApiDate } from '../../../common/summary/DatoSvar';

interface Props {
    apiValues: OmBarnaApiData;
}

const OmBarnaSummary = ({ apiValues }: Props) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'step.oppsummering.om-barna.header')}>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.om-barna.harAleneomsorg')}>
                <JaNeiSvar harSvartJa={apiValues?.harAleneomsorg} />
            </SummaryBlock>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.om-barna.hvilkeAvBarnaAleneomsorg')}>
                <SummaryList
                    items={apiValues.harAleneomsorgFor.barn}
                    itemRenderer={(barn) =>
                        `${intlHelper(intl, 'step.oppsummering.om-barna.født')} ${prettifyApiDate(
                            barn.fødselsdato
                        )} ${formatName(barn.fornavn, barn.etternavn)}`
                    }
                />
                <SummaryList
                    items={apiValues.harAleneomsorgFor.andreBarn}
                    itemRenderer={(barn) =>
                        `${intlHelper(intl, 'step.oppsummering.om-barna.født')} ${prettifyApiDate(barn.fødselsdato)} ${
                            barn.navn
                        }`
                    }
                />
            </SummaryBlock>
            <SummaryBlock header={intlHelper(intl, 'step.oppsummering.om-barna.harNoenUtvidetRett')}>
                <JaNeiSvar harSvartJa={apiValues?.harUtvidetRett} />
            </SummaryBlock>
            {apiValues.harUtvidetRett && (
                <SummaryBlock header={intlHelper(intl, 'step.oppsummering.om-barna.hvilkeAvBarnaUtvRett')}>
                    <SummaryList
                        items={apiValues.harUtvidetRettFor.barn}
                        itemRenderer={(barn) =>
                            `${intlHelper(intl, 'step.oppsummering.om-barna.født')} ${prettifyApiDate(
                                barn.fødselsdato
                            )} ${formatName(barn.fornavn, barn.etternavn)}`
                        }
                    />
                    <SummaryList
                        items={apiValues.harUtvidetRettFor.andreBarn}
                        itemRenderer={(barn) =>
                            `${intlHelper(intl, 'step.oppsummering.om-barna.født')} ${prettifyApiDate(
                                barn.fødselsdato
                            )} ${barn.navn}`
                        }
                    />
                </SummaryBlock>
            )}
        </SummarySection>
    );
};

export default OmBarnaSummary;
