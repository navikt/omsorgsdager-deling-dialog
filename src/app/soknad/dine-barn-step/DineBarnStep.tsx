import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { dateToday, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import AnnetBarnListAndDialog from '@navikt/sif-common-forms/lib/annet-barn/AnnetBarnListAndDialog';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { Barn, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { nYearsAgo } from '../../utils/aldersUtils';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../StepID';

interface OwnProps {
    barn: Barn[];
}

type Props = OwnProps;

const DineBarnStep = ({ barn }: Props) => {
    const intl = useIntl();
    const {
        values: { andreBarn },
    } = useFormikContext<SoknadFormData>();
    const kanFortsette = (barn !== undefined && barn.length > 0) || andreBarn.length > 0;

    return (
        <SoknadFormStep id={StepID.DINE_BARN} showSubmitButton={kanFortsette}>
            <CounsellorPanel>
                <p>{intlHelper(intl, 'step.dine-barn.info.title')}</p>
                {intlHelper(intl, 'step.dine-barn.info')}
            </CounsellorPanel>
            {andreBarn.length === 0 && barn.length === 0 && (
                <Box margin="l">
                    <AlertStripe type={'info'}>{intlHelper(intl, 'step.dine-barn.info.ingenbarn.1')}</AlertStripe>
                </Box>
            )}
            {barn.length > 0 && (
                <Box margin="xl">
                    <ContentWithHeader header={intlHelper(intl, 'step.dine-barn.listHeader.registrerteBarn')}>
                        <ItemList<Barn>
                            getItemId={(registrerteBarn) => registrerteBarn.aktørId}
                            getItemTitle={(registrerteBarn) => registrerteBarn.etternavn}
                            labelRenderer={(registrerteBarn) =>
                                `${intlHelper(intl, 'step.dine-barn.født')} ${prettifyDate(
                                    registrerteBarn.fødselsdato
                                )} ${formatName(registrerteBarn.fornavn, registrerteBarn.etternavn)}`
                            }
                            items={barn}
                        />
                    </ContentWithHeader>
                </Box>
            )}
            <Box margin="xl">
                <ContentWithHeader
                    header={
                        andreBarn.length === 0
                            ? intlHelper(intl, 'step.dine-barn.info.spm.andreBarn')
                            : intlHelper(intl, 'step.dine-barn.info.spm.flereBarn')
                    }>
                    {intlHelper(intl, 'step.dine-barn.info.spm.text')}
                </ContentWithHeader>
            </Box>
            <Box margin="l">
                <AnnetBarnListAndDialog<SoknadFormField>
                    name={SoknadFormField.andreBarn}
                    labels={{
                        addLabel: 'Legg til barn',
                        listTitle: 'Andre barn',
                        modalTitle: 'Legg til barn',
                    }}
                    maxDate={dateToday}
                    minDate={nYearsAgo(18)}
                    advarsel={intlHelper(intl, 'step.dine-barn.formLeggTilBarn.advarsel')}
                />
            </Box>
            {andreBarn.length === 0 && barn.length === 0 && (
                <Box margin="l">
                    <AlertStripe type={'advarsel'}>{intlHelper(intl, 'step.dine-barn.info.ingenbarn.2')}</AlertStripe>
                </Box>
            )}
        </SoknadFormStep>
    );
};

export default DineBarnStep;
