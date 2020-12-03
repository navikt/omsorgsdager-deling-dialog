import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FormQuestion, { FormQuestionProps } from '@navikt/sif-common-soknad/lib/form-question/FormQuestion';
import { IntroFormField } from './introFormConfig';

type Props = FormQuestionProps<IntroFormField>;

const IntroFormQuestion = (props: Props) => {
    const intl = useIntl();
    return <FormQuestion legend={intlHelper(intl, `introForm.form.${props.name}.spm`)} {...props} />;
};

export default IntroFormQuestion;
