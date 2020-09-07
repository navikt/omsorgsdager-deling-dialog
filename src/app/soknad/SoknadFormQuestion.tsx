import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FormQuestion, { FormQuestionProps } from '../../common/form-question/FormQuestion';
import QuestionVisibilityBlock from '../../common/question-visibility-block/QuestionVisibilityBlock';
import { SoknadFormField } from '../types/SoknadFormData';
import { StepID } from './StepID';

type Props = FormQuestionProps<SoknadFormField> & { stepId: StepID };

const SoknadFormQuestion = (props: Props) => {
    const intl = useIntl();
    return (
        <QuestionVisibilityBlock fieldName={props.name}>
            <FormQuestion legend={intlHelper(intl, `step.${props.stepId}.form.${props.name}.spm`)} {...props} />
        </QuestionVisibilityBlock>
    );
};

export default SoknadFormQuestion;
