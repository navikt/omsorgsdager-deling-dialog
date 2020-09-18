import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FormikCheckboxPanelGroup, getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { CheckboksPanelProps } from 'nav-frontend-skjema';
import FormQuestion from '../../../common/form-question/FormQuestion';
import { Barn, SoknadFormData, SoknadFormField } from 'app/types/SoknadFormData';
import { aldersBegrensingOver } from '../../utils/aldersUtils';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../StepID';

interface Props {
    barn: Barn[];
}

const SoknadFormComponents = getTypedFormComponents<SoknadFormField, SoknadFormData>();

const cleanupOmBarnaStep = (values: SoknadFormData): SoknadFormData => {
    const cleanedValues = { ...values };
    if (values.harUtvidetRett === YesOrNo.NO) {
        cleanedValues.harUtvidetRettFor = [];
    }
    return cleanedValues;
};

const OmBarnaStep = ({ barn }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const checkboxes: CheckboksPanelProps[] = [];
    barn.map((barnet) =>
        checkboxes.push({
            label: `${intlHelper(intl, 'step.om-barna.født')} ${prettifyDate(barnet.fødselsdato)} ${formatName(
                barnet.fornavn,
                barnet.etternavn
            )}`,
            value: barnet.aktørId,
        })
    );

    if (values.andreBarn !== undefined) {
        values.andreBarn.map((barnet) =>
            checkboxes.push({
                label: `${intlHelper(intl, 'step.om-barna.født')} ${prettifyDate(barnet.fødselsdato)} ${barnet.navn}`,
                value: barnet.fnr,
            })
        );
    }
    const { harAleneomsorg, harUtvidetRett, andreBarn } = values;

    const alleBarnOver12ogIngenUtvidetRett = (): boolean => {
        const kunBarnOver12iBarn = barn.filter((barnet) => aldersBegrensingOver(barnet.fødselsdato, 12)).length === 0;
        const kunBarnOver12iAndreBarn =
            andreBarn.filter((barnet) => aldersBegrensingOver(barnet.fødselsdato, 12)).length === 0;
        return harUtvidetRett === YesOrNo.NO && kunBarnOver12iBarn && kunBarnOver12iAndreBarn;
    };

    const kanFortsette = harAleneomsorg === YesOrNo.YES && !alleBarnOver12ogIngenUtvidetRett();
    return (
        <SoknadFormStep id={StepID.OM_BARNA} showSubmitButton={kanFortsette} onStepCleanup={cleanupOmBarnaStep}>
            <CounsellorPanel>{intlHelper(intl, 'step.om-barna.info')}</CounsellorPanel>
            <FormBlock>
                <FormQuestion
                    name={SoknadFormField.harAleneomsorg}
                    legend={intlHelper(intl, 'step.om-barna.form.spm.harAleneOmsorg')}
                    validate={validateYesOrNoIsAnswered}
                    showStop={harAleneomsorg === YesOrNo.NO}
                    stopMessage="For å overføre dager ..."
                />
            </FormBlock>
            {harAleneomsorg === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <FormikCheckboxPanelGroup<SoknadFormField>
                            legend={intlHelper(intl, 'step.om-barna.form.spm.hvilkeAvBarnaAleneomsorg')}
                            name={SoknadFormField.harAleneomsorgFor}
                            checkboxes={checkboxes}
                            validate={validateRequiredList}
                        />
                    </FormBlock>

                    <FormBlock>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={SoknadFormField.harUtvidetRett}
                            legend={intlHelper(intl, 'step.om-barna.form.spm.harNoenUtvidetRett')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>

                    {harUtvidetRett === YesOrNo.YES && (
                        <FormBlock>
                            <FormikCheckboxPanelGroup<SoknadFormField>
                                legend={intlHelper(intl, 'step.om-barna.form.spm.hvilkeAvBarnaUtvRett')}
                                name={SoknadFormField.harUtvidetRettFor}
                                checkboxes={checkboxes}
                                validate={validateRequiredList}
                            />
                        </FormBlock>
                    )}
                    {harUtvidetRett === YesOrNo.NO && (
                        <Box margin="l">
                            <AlertStripe type={'info'}>{intlHelper(intl, 'step.om-barna.info.barnOver12')}</AlertStripe>
                        </Box>
                    )}
                </>
            )}
        </SoknadFormStep>
    );
};

export default OmBarnaStep;
