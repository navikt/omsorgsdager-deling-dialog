/* eslint-disable react/display-name */
import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormikYesOrNoQuestion, {
    FormikYesOrNoQuestionProps,
} from '@navikt/sif-common-formik/lib/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import InfoMessage from '../info-message/InfoMessage';
import QuestionVisibilityBlock from '../question-visibility-block/QuestionVisibilityBlock';
import StopMessage from '../stop-message/StopMessage';

interface Props<FieldName> extends FormikYesOrNoQuestionProps<FieldName> {
    showStop?: boolean;
    description?: React.ReactNode;
    stopMessage?: React.ReactNode;
    infoMessage?: React.ReactNode;
    showInfo?: boolean;
    legend?: React.ReactNode;
    children?: React.ReactNode;
    useVisibilityContext?: boolean;
}

export function getTypedFormQuestion<FieldName>() {
    return (props: Props<FieldName>) => <FormQuestion<FieldName> {...props} />;
}

function FormQuestion<FieldName>(props: Props<FieldName>) {
    const { name, showStop, description, stopMessage, showInfo, infoMessage, legend, children } = props;
    return (
        <QuestionVisibilityBlock<FieldName> fieldName={name}>
            <FormBlock>
                {children || <FormikYesOrNoQuestion name={name} legend={legend} description={description} />}
                <div aria-live="polite">
                    {showStop && stopMessage && <StopMessage>{stopMessage}</StopMessage>}
                    {showInfo && infoMessage && <InfoMessage>{infoMessage}</InfoMessage>}
                </div>
            </FormBlock>
        </QuestionVisibilityBlock>
    );
}

export default FormQuestion;
