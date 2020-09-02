import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Arbeidssituasjon } from '../../types/SoknadFormData';
import { IntroFormData, IntroFormField, introFormInitialValues } from './introFormConfig';

interface Props {
    onValidSubmit: () => void;
}

const IntroFormComponents = getTypedFormComponents<IntroFormField, IntroFormData>();

const getIntroFormLegend = (intl: IntlShape, field: IntroFormField): string => {
    return intlHelper(intl, `introForm.${field}.spm`);
};

const IntroForm = ({ onValidSubmit }: Props) => {
    const intl = useIntl();
    return (
        <IntroFormComponents.FormikWrapper
            initialValues={introFormInitialValues}
            onSubmit={onValidSubmit}
            renderForm={() => {
                return (
                    <IntroFormComponents.Form
                        includeValidationSummary={true}
                        includeButtons={true}
                        onValidSubmit={() => {
                            console.log('sdf');
                        }}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}
                        submitButtonLabel={'Fortsett'}>
                        <FormBlock>
                            <IntroFormComponents.YesOrNoQuestion
                                name={IntroFormField.erArbeidstakerSnEllerFrilanser}
                                legend={getIntroFormLegend(intl, IntroFormField.erArbeidstakerSnEllerFrilanser)}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </FormBlock>
                        <FormBlock>
                            <IntroFormComponents.YesOrNoQuestion
                                name={IntroFormField.harAleneomsorg}
                                legend={getIntroFormLegend(intl, IntroFormField.harAleneomsorg)}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </FormBlock>
                        <FormBlock>
                            <IntroFormComponents.YesOrNoQuestion
                                name={IntroFormField.mottakerErEktefelleEllerPartner}
                                legend={getIntroFormLegend(intl, IntroFormField.mottakerErEktefelleEllerPartner)}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </FormBlock>
                        <FormBlock>
                            <IntroFormComponents.CheckboxPanelGroup
                                name={IntroFormField.arbeidssituasjonMottaker}
                                legend={getIntroFormLegend(intl, IntroFormField.arbeidssituasjonMottaker)}
                                validate={validateRequiredList}
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
                            />
                        </FormBlock>
                    </IntroFormComponents.Form>
                );
            }}
        />
    );
};

export default IntroForm;
