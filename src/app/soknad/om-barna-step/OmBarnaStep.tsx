import React from 'react';
import SoknadFormStep from '../SoknadFormStep';
import { StepConfigProps } from '../stepConfigProps';
import { StepID } from '../StepID';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { getTypedFormComponents, FormikCheckboxPanelGroup, YesOrNo } from '@navikt/sif-common-formik/lib';
import { SoknadFormField, SoknadFormData, Barn } from 'app/types/SoknadFormData';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
//import { useFormikContext } from 'formik';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import AlertStripe from 'nav-frontend-alertstriper';
import { useFormikContext } from 'formik';

interface OwnProps {
    barn: Barn[];
}

type Props = OwnProps & StepConfigProps;

const SoknadFormComponents = getTypedFormComponents<SoknadFormField, SoknadFormData>();

const OmBarnaStep = ({ onResetSoknad, onValidSubmit, soknadStepsConfig: soknadStepsConfig, barn }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const checkboxes: import('nav-frontend-skjema').CheckboksPanelProps[] = [];
    barn.map((barnet) =>
        checkboxes.push({
            label: barnet.fornavn,
            value: barnet.aktørId,
        })
    );

    if (values.andreBarn !== undefined) {
        values.andreBarn.map((barnet) =>
            checkboxes.push({
                label: barnet.navn,
                value: barnet.fnr,
            })
        );
    }
    const { harAleneomsorg, harUtvidetRett } = values;
    return (
        <SoknadFormStep
            id={StepID.OM_BARNA}
            soknadStepsConfig={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}>
            <CounsellorPanel>{intlHelper(intl, 'step.om-barna.info')}</CounsellorPanel>
            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    name={SoknadFormField.harAleneomsorg}
                    legend={intlHelper(intl, 'step.om-barna.form.spm1')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            {harAleneomsorg === YesOrNo.YES && (
                <FormBlock>
                    <FormikCheckboxPanelGroup<SoknadFormField>
                        legend={intlHelper(intl, 'step.om-barna.form.spm2')}
                        name={SoknadFormField.harAleneomsorgFor}
                        checkboxes={checkboxes}
                    />
                </FormBlock>
            )}

            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    name={SoknadFormField.harUtvidetRett}
                    legend={intlHelper(intl, 'step.om-barna.form.spm3')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>

            {harUtvidetRett === YesOrNo.YES && (
                <FormBlock>
                    <FormikCheckboxPanelGroup<SoknadFormField>
                        legend={intlHelper(intl, 'step.om-barna.form.spm4')}
                        name={SoknadFormField.harUtvidetRettFor}
                        checkboxes={checkboxes}
                    />
                </FormBlock>
            )}
            <Box margin="l">
                <AlertStripe type={'info'}>{intlHelper(intl, 'step.om-barna.info2')}</AlertStripe>
            </Box>
        </SoknadFormStep>
    );
};

export default OmBarnaStep;
