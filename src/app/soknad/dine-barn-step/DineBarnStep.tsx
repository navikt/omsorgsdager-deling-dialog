import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import AnnetBarnListAndDialog from '@navikt/sif-common-forms/lib/annet-barn/AnnetBarnListAndDialog';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import AlertStripe from 'nav-frontend-alertstriper';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SoknadFormField, Barn } from 'app/types/SoknadFormData';
import { useFormikContext } from 'formik';
import { SoknadFormData } from '../../types/SoknadFormData';
import ItemList from '@navikt/sif-common-core/lib/components/item-list/ItemList';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface OwnProps {
    barn: Barn[];
}

type Props = OwnProps & StepConfigProps;

const DineBarnStep = ({ barn, ...formStepProps }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const kanFortsette = (barn !== undefined && barn.length > 0) || values.andreBarn.length > 0;

    return (
        <SoknadFormStep id={StepID.DINE_BARN} {...formStepProps} showSubmitButton={kanFortsette}>
            <CounsellorPanel>{intlHelper(intl, 'step.dine-barn.info')}</CounsellorPanel>
            {values.andreBarn === undefined && barn.length === 0 && (
                <Box margin="l">
                    <AlertStripe type={'info'}>{intlHelper(intl, 'step.dine-barn.info.ingenbarn')}</AlertStripe>
                </Box>
            )}
            <Box margin="l">
                <ItemList<Barn>
                    getItemId={(registrerteBarn) => registrerteBarn.aktørId}
                    getItemTitle={(registrerteBarn) => registrerteBarn.etternavn}
                    labelRenderer={(registrerteBarn) =>
                        intlHelper(intl, 'step.dine-barn.født') +
                        ' ' +
                        prettifyDate(registrerteBarn.fødselsdato) +
                        ' ' +
                        formatName(registrerteBarn.fornavn, registrerteBarn.etternavn)
                    }
                    items={barn}
                />
            </Box>
            <Box margin="l">
                <ContentWithHeader
                    header={
                        values.andreBarn === undefined || values.andreBarn.length === 0
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
                />
            </Box>
        </SoknadFormStep>
    );
};

export default DineBarnStep;
