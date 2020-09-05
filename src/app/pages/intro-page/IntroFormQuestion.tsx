import React from 'react';
import FormQuestion, { FormQuestionProps } from '../../../common/form-question/FormQuestion';
import { IntroFormField } from './introFormConfig';
import QuestionVisibilityBlock from '../../../common/question-visibility-block/QuestionVisibilityBlock';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

type Props = FormQuestionProps<IntroFormField>;

const IntroFormQuestion = (props: Props) => {
    const intl = useIntl();
    return (
        <QuestionVisibilityBlock fieldName={props.name}>
            <FormQuestion legend={intlHelper(intl, `introForm.${props.name}.spm`)} {...props} />
        </QuestionVisibilityBlock>
    );
};

export default IntroFormQuestion;
