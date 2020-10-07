import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import FormQuestion from '@navikt/sif-common-soknad/lib/form-question/FormQuestion';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';
import { Arbeidssituasjon, DinSituasjonFormData, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import SoknadFormComponents from '../SoknadFormComponents';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';

const cleanupDinSituasjonStep = (values: SoknadFormData): SoknadFormData => {
    const cleanedValues = { ...values };
    if (values.harBruktOmsorgsdagerEtter1Juli === YesOrNo.NO) {
        cleanedValues.antallDagerBruktEtter1Juli = undefined;
    }
    return cleanedValues;
};

const DinSituasjonStep = () => {
    const intl = useIntl();
    const { values } = useFormikContext<DinSituasjonFormData>();
    const { harBruktOmsorgsdagerEtter1Juli } = values;
    const stepId = StepID.DIN_SITUASJON;

    const { arbeiderINorge } = values;
    const kanFortsette = arbeiderINorge === YesOrNo.YES;

    const arbeiderINorgeStopMessage = (
        <>
            {intlHelper(intl, 'step.din_situasjon.form.arbeiderINorge.stopMessage')}
            <ul>
                <li>{intlHelper(intl, 'arbeidstaker')}</li>
                <li>{intlHelper(intl, 'selvstendigNæringsdrivende')}</li>
                <li>{intlHelper(intl, 'frilanser')}</li>
            </ul>
        </>
    );

    return (
        <SoknadFormStep id={stepId} showSubmitButton={kanFortsette} onStepCleanup={cleanupDinSituasjonStep}>
            <CounsellorPanel>
                <FormattedMessage id="step.din_situasjon.veileder.intro.1" />
                <p>
                    <FormattedMessage id="step.din_situasjon.veileder.intro.2" />
                    <Lenke href={getLenker(intl.locale).medlemskapIFolketrygden} target="_blank">
                        {intlHelper(intl, 'nav.no')}
                    </Lenke>
                </p>
            </CounsellorPanel>
            <FormBlock>
                <SoknadFormComponents.YesOrNoQuestion
                    name={SoknadFormField.borINorge}
                    legend={intlHelper(intl, 'step.din_situasjon.form.borINorge.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </FormBlock>
            <FormQuestion
                name={SoknadFormField.arbeiderINorge}
                legend={intlHelper(intl, 'step.din_situasjon.form.arbeiderINorge.spm')}
                validate={validateYesOrNoIsAnswered}
                showStop={arbeiderINorge === YesOrNo.NO}
                stopMessage={arbeiderINorgeStopMessage}
            />
            {kanFortsette === true && (
                <>
                    <FormBlock>
                        <SoknadFormComponents.CheckboxPanelGroup
                            legend={intlHelper(intl, 'step.din_situasjon.form.arbeidssituasjon.spm')}
                            name={SoknadFormField.arbeidssituasjon}
                            checkboxes={[
                                {
                                    value: Arbeidssituasjon.arbeidstaker,
                                    label: intlHelper(intl, `arbeidssituasjon.${Arbeidssituasjon.arbeidstaker}`),
                                },
                                {
                                    value: Arbeidssituasjon.selvstendigNæringsdrivende,
                                    label: intlHelper(
                                        intl,
                                        `arbeidssituasjon.${Arbeidssituasjon.selvstendigNæringsdrivende}`
                                    ),
                                },
                                {
                                    value: Arbeidssituasjon.frilanser,
                                    label: intlHelper(intl, `arbeidssituasjon.${Arbeidssituasjon.frilanser}`),
                                },
                            ]}
                            validate={validateRequiredList}
                        />
                    </FormBlock>
                    <FormBlock>
                        <SoknadFormComponents.YesOrNoQuestion
                            name={SoknadFormField.harBruktOmsorgsdagerEtter1Juli}
                            legend={intlHelper(intl, 'step.din_situasjon.form.harBruktOmsorgsdagerEtter1Juli.spm')}
                            validate={validateYesOrNoIsAnswered}
                        />
                    </FormBlock>
                    {harBruktOmsorgsdagerEtter1Juli === YesOrNo.YES && (
                        <FormBlock>
                            <SoknadFormComponents.Input
                                name={SoknadFormField.antallDagerBruktEtter1Juli}
                                label={intlHelper(intl, 'step.din_situasjon.form.antallDagerBruktEtter1Juli.spm')}
                                validate={validateRequiredNumber({ min: 1 })}
                                inputMode="numeric"
                                style={{ maxWidth: '4rem' }}
                                maxLength={2}
                            />
                        </FormBlock>
                    )}
                </>
            )}
        </SoknadFormStep>
    );
};

export default DinSituasjonStep;
