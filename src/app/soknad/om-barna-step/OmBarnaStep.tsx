import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { QuestionVisibilityContext } from '@navikt/sif-common-soknad/lib/question-visibility/QuestionVisibilityContext';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import { CheckboksPanelProps } from 'nav-frontend-skjema';
import getLenker from '../../lenker';
import { Barn, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormQuestion from '../SoknadFormQuestion';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import { getOmBarnaFormStop, OmBarnaFormQuestions, OmBarnaFormStop } from './omBarnaStepFormConfig';

interface Props {
    barn: Barn[];
}

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

    const { andreBarn } = values;
    const barnOptions = getBarnOptions(barn, andreBarn, intl);
    const antallBarn = barnOptions.length;

    const omBarnaStop = getOmBarnaFormStop(values, barn);
    const visibility = OmBarnaFormQuestions.getVisbility({ ...values, antallBarn, omBarnaStop });
    const allQuestionsIsAnswered = visibility.areAllQuestionsAnswered();
    const kanFortsette = allQuestionsIsAnswered && omBarnaStop === undefined;

    return (
        <SoknadFormStep
            id={StepID.OM_BARNA}
            showSubmitButton={kanFortsette}
            onStepCleanup={(values) => cleanupOmBarnaStep(values, barn, andreBarn)}
            showNotAllQuestionsAnsweredMessage={allQuestionsIsAnswered === false}
            stepTitle={intlHelper(intl, 'step.om-barna.stepTitle.plural', { antallBarn })}>
            <CounsellorPanel>
                {intlHelper(intl, 'step.om-barna.info.1')}
                <p>{intlHelper(intl, 'step.om-barna.info.2')}</p>
                <p>{intlHelper(intl, 'step.om-barna.info.3')}</p>
                <Lenke href={getLenker(intl.locale).merOmFastBostedOgSamvær} target="_blank">
                    {intlHelper(intl, 'lesMerOmFastBostedOgSamvær')}
                </Lenke>
            </CounsellorPanel>
            <QuestionVisibilityContext.Provider value={{ visibility }}>
                <SoknadFormQuestion
                    name={SoknadFormField.harAleneomsorg}
                    legend={
                        antallBarn === 1
                            ? intlHelper(intl, 'step.om-barna.form.spm.harAleneOmsorg.ettBarn')
                            : intlHelper(intl, 'step.om-barna.form.spm.harAleneOmsorg.flereBarn')
                    }
                    validate={validateYesOrNoIsAnswered}
                    showStop={omBarnaStop === OmBarnaFormStop.ikkeAleneomsorgForOverføringOgFordeling}
                    stopMessage={intlHelper(intl, 'step.oppsummering.om-barna.harAleneomsorg.stopMessage')}
                />
                <SoknadFormQuestion name={SoknadFormField.harAleneomsorgFor}>
                    <SoknadFormComponents.CheckboxPanelGroup
                        legend={intlHelper(intl, 'step.om-barna.form.spm.hvilkeAvBarnaAleneomsorg')}
                        name={SoknadFormField.harAleneomsorgFor}
                        checkboxes={barnOptions}
                        validate={validateRequiredList}
                    />
                </SoknadFormQuestion>
                <SoknadFormQuestion
                    name={SoknadFormField.harUtvidetRett}
                    legend={
                        antallBarn === 1
                            ? intlHelper(intl, 'step.om-barna.form.spm.harNoenUtvidetRett.ettBarn')
                            : intlHelper(intl, 'step.om-barna.form.spm.harNoenUtvidetRett.flereBarn')
                    }
                    validate={validateYesOrNoIsAnswered}
                    showStop={omBarnaStop === OmBarnaFormStop.alleBarnErOver12ogIngenUtvidetRett}
                    stopMessage={intlHelper(intl, 'step.om-barna.info.barnOver12')}
                />
                <SoknadFormQuestion name={SoknadFormField.harUtvidetRettFor}>
                    <SoknadFormComponents.CheckboxPanelGroup
                        legend={intlHelper(intl, 'step.om-barna.form.spm.hvilkeAvBarnaUtvRett')}
                        name={SoknadFormField.harUtvidetRettFor}
                        checkboxes={barnOptions}
                        validate={validateRequiredList}
                    />
                </SoknadFormQuestion>
            </QuestionVisibilityContext.Provider>
        </SoknadFormStep>
    );
};

export default OmBarnaStep;
