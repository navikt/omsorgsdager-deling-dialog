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
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import AlertStripe from 'nav-frontend-alertstriper';
import { useFormikContext } from 'formik';
import FormQuestion from '../../../common/form-question/FormQuestion';
import { validateRequiredList } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { aldersBegrensingOver } from '../../utils/aldersUtils';
import { CheckboksPanelProps } from 'nav-frontend-skjema';

interface OwnProps {
    barn: Barn[];
}

type Props = OwnProps & StepConfigProps;

const SoknadFormComponents = getTypedFormComponents<SoknadFormField, SoknadFormData>();

const OmBarnaStep = ({ onResetSoknad, onValidSubmit, soknadStepsConfig: soknadStepsConfig, barn }: Props) => {
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
        <SoknadFormStep
            id={StepID.OM_BARNA}
            soknadStepsConfig={soknadStepsConfig}
            onResetSoknad={onResetSoknad}
            onValidSubmit={onValidSubmit}
            showSubmitButton={kanFortsette}>
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
