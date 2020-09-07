import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import AnnetBarnListAndDialog from '@navikt/sif-common-forms/lib/annet-barn/AnnetBarnListAndDialog';
import { useIntl } from 'react-intl';
//import { validateRequiredList } from '@navikt/sif-common-core/lib/validation/fieldValidations';
//import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
// import Panel from 'nav-frontend-paneler';
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

interface Props {
    //  registrerteBarn: Barn[] | undefined;
    registrerteBarn: Barn[];
}

const DineBarnStep = ({
    onResetSoknad,
    onValidSubmit,
    config: soknadStepsConfig,
    registrerteBarn,
}: StepConfigProps & Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    return (
        <SoknadFormStep
            id={StepID.DINE_BARN}
            config={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}>
            <CounsellorPanel>{intlHelper(intl, 'step.dine-barn.info1')}</CounsellorPanel>
            {values.andreBarn === undefined && registrerteBarn.length === 0 && (
                <Box margin="l">
                    <AlertStripe type={'info'}>{intlHelper(intl, 'step.dine-barn.info.ingenbarn')}</AlertStripe>
                </Box>
            )}
            <Box margin="l">
                <ItemList<Barn>
                    getItemId={(registrerteBarn) => registrerteBarn.aktørId}
                    getItemTitle={(registrerteBarn) => registrerteBarn.etternavn}
                    labelRenderer={(registrerteBarn) =>
                        'Født ' +
                        prettifyDate(registrerteBarn.fødselsdato) +
                        ' ' +
                        formatName(registrerteBarn.fornavn, registrerteBarn.etternavn)
                    }
                    items={registrerteBarn}
                />
            </Box>
            <Box margin="l">
                <AnnetBarnListAndDialog<SoknadFormField>
                    name={SoknadFormField.andreBarn}
                    labels={{
                        addLabel: 'Legg til barn',
                        listTitle: 'Registrerte barn',
                        modalTitle: 'Legg til barn',
                    }}
                />
            </Box>
            <Box margin="l">
                <ContentWithHeader
                    header={
                        values.andreBarn === undefined
                            ? intlHelper(intl, 'step.dine-barn.info.spm1')
                            : intlHelper(intl, 'step.dine-barn.info.spm2')
                    }>
                    {intlHelper(intl, 'step.dine-barn.info.spm.text')}
                </ContentWithHeader>
            </Box>
        </SoknadFormStep>
    );
};

export default DineBarnStep;
