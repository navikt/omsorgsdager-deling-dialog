import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { yesOrNoIsAnswered } from '@navikt/sif-common-core/lib/utils/yesOrNoUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import FormQuestion from '@navikt/sif-common-soknad/lib/form-question/FormQuestion';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { CheckboksPanelProps } from 'nav-frontend-skjema';
import getLenker from '../../lenker';
import { Barn, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { aldersBegrensingOver } from '../../utils/aldersUtils';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';

interface Props {
    barn: Barn[];
}

// const cleanupOmBarnaStep = (values: SoknadFormData): SoknadFormData => {
//     const cleanedValues = { ...values };
//     if (values.harUtvidetRett === YesOrNo.NO) {
//         cleanedValues.harUtvidetRettFor = [];
//     }
//     return cleanedValues;
// };

const cleanupOmBarnaStep = (values: SoknadFormData, barn: Barn[], andreBarn: AnnetBarn[]): SoknadFormData => {
    if (barn.length + andreBarn.length > 1) {
        return {
            ...values,
            harAleneomsorgFor: values.harAleneomsorg === YesOrNo.YES ? values.harAleneomsorgFor : [],
            harUtvidetRettFor: values.harUtvidetRett === YesOrNo.YES ? values.harUtvidetRettFor : [],
        };
    }
    const barnId = barn.length === 1 ? barn[0].aktørId : andreBarn[0].fnr;
    const harAleneomsorg = values.harAleneomsorg === YesOrNo.YES;
    const harUtvidetRett = values.harUtvidetRett === YesOrNo.YES;
    return {
        ...values,
        harAleneomsorgFor: harAleneomsorg ? [barnId] : [],
        harUtvidetRettFor: harUtvidetRett ? [barnId] : [],
    };
};

const getBarnOptions = (barn: Barn[] = [], andreBarn: AnnetBarn[] = [], intl: IntlShape): CheckboksPanelProps[] => {
    return [
        ...barn.map((barnet) => ({
            label: `${intlHelper(intl, 'step.om-barna.født')} ${prettifyDate(barnet.fødselsdato)} ${formatName(
                barnet.fornavn,
                barnet.etternavn
            )}`,
            value: barnet.aktørId,
        })),
        ...andreBarn.map((barnet) => ({
            label: `${intlHelper(intl, 'step.om-barna.født')} ${prettifyDate(barnet.fødselsdato)} ${barnet.navn}`,
            value: barnet.fnr,
        })),
    ];
};

const OmBarnaStep = ({ barn }: Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();

    const { gjelderMidlertidigPgaKorona, harAleneomsorg, harUtvidetRett, andreBarn } = values;
    const erKoronasøknad = gjelderMidlertidigPgaKorona === YesOrNo.YES;
    const barnOptions = getBarnOptions(barn, andreBarn, intl);
    const antallBarn = barnOptions.length;

    const alleBarnOver12ogIngenUtvidetRett = (): boolean => {
        const kunBarnOver12iBarn = barn.filter((barnet) => aldersBegrensingOver(barnet.fødselsdato, 12)).length === 0;
        const kunBarnOver12iAndreBarn =
            andreBarn.filter((barnet) => aldersBegrensingOver(barnet.fødselsdato, 12)).length === 0;
        return harUtvidetRett === YesOrNo.NO && kunBarnOver12iBarn && kunBarnOver12iAndreBarn;
    };

    const kanFortsette = erKoronasøknad
        ? yesOrNoIsAnswered(harAleneomsorg) && yesOrNoIsAnswered(harUtvidetRett)
        : yesOrNoIsAnswered(harAleneomsorg) &&
          harUtvidetRett === YesOrNo.YES &&
          harAleneomsorg === YesOrNo.YES &&
          !alleBarnOver12ogIngenUtvidetRett();

    const stopPgaIkkeAleneomsorgForOverføringOgFordeling = erKoronasøknad === false && harAleneomsorg === YesOrNo.NO;

    return (
        <SoknadFormStep
            id={StepID.OM_BARNA}
            showSubmitButton={kanFortsette}
            onStepCleanup={(values) => cleanupOmBarnaStep(values, barn, andreBarn)}
            showNotAllQuestionsAnsweredMessage={yesOrNoIsAnswered(harAleneomsorg) === false}
            stepTitle={intlHelper(intl, 'step.om-barna.stepTitle.plural', { antallBarn })}>
            <CounsellorPanel>
                {intlHelper(intl, 'step.om-barna.info.1')}
                <p>{intlHelper(intl, 'step.om-barna.info.2')}</p>
                <p>{intlHelper(intl, 'step.om-barna.info.3')}</p>
                <Lenke href={getLenker(intl.locale).merOmFastBostedOgSamvær} target="_blank">
                    {intlHelper(intl, 'lesMerOmFastBostedOgSamvær')}
                </Lenke>
            </CounsellorPanel>
            <FormBlock>
                <FormQuestion
                    name={SoknadFormField.harAleneomsorg}
                    legend={
                        antallBarn === 1
                            ? intlHelper(intl, 'step.om-barna.form.spm.harAleneOmsorg.ettBarn')
                            : intlHelper(intl, 'step.om-barna.form.spm.harAleneOmsorg.flereBarn')
                    }
                    validate={validateYesOrNoIsAnswered}
                    showStop={stopPgaIkkeAleneomsorgForOverføringOgFordeling}
                    stopMessage={intlHelper(intl, 'step.oppsummering.om-barna.harAleneomsorg.stopMessage')}
                />
            </FormBlock>
            {harAleneomsorg === YesOrNo.YES && antallBarn > 1 && (
                <FormBlock>
                    <SoknadFormComponents.CheckboxPanelGroup
                        legend={intlHelper(intl, 'step.om-barna.form.spm.hvilkeAvBarnaAleneomsorg')}
                        name={SoknadFormField.harAleneomsorgFor}
                        checkboxes={barnOptions}
                        validate={validateRequiredList}
                    />
                </FormBlock>
            )}
            {yesOrNoIsAnswered(harAleneomsorg) && !stopPgaIkkeAleneomsorgForOverføringOgFordeling && (
                <>
                    <FormBlock>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={SoknadFormField.harUtvidetRett}
                            legend={
                                antallBarn === 1
                                    ? intlHelper(intl, 'step.om-barna.form.spm.harNoenUtvidetRett.ettBarn')
                                    : intlHelper(intl, 'step.om-barna.form.spm.harNoenUtvidetRett.flereBarn')
                            }
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
                    {harUtvidetRett === YesOrNo.YES && antallBarn > 1 && (
                        <FormBlock>
                            <SoknadFormComponents.CheckboxPanelGroup
                                legend={intlHelper(intl, 'step.om-barna.form.spm.hvilkeAvBarnaUtvRett')}
                                name={SoknadFormField.harUtvidetRettFor}
                                checkboxes={barnOptions}
                                validate={validateRequiredList}
                            />
                        </FormBlock>
                    )}
                    {alleBarnOver12ogIngenUtvidetRett() && (
                        <Box margin="l">
                            <AlertStripe type={'advarsel'}>
                                {intlHelper(intl, 'step.om-barna.info.barnOver12')}
                            </AlertStripe>
                        </Box>
                    )}
                </>
            )}
        </SoknadFormStep>
    );
};

export default OmBarnaStep;
