/* eslint-disable react/display-name */
import React from 'react';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormikYesOrNoQuestion, {
    FormikYesOrNoQuestionProps,
} from '@navikt/sif-common-formik/lib/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import InfoMessage from '../info-message/InfoMessage';
import StopMessage from '../stop-message/StopMessage';

export interface FormQuestionProps<FieldName> extends FormikYesOrNoQuestionProps<FieldName> {
    showStop?: boolean;
    description?: React.ReactNode;
    stopMessage?: React.ReactNode;
    infoMessage?: React.ReactNode;
    showInfo?: boolean;
    legend?: React.ReactNode;
    children?: React.ReactNode;
}

export function getTypedFormQuestion<FieldName>() {
    return (props: FormQuestionProps<FieldName>) => <FormQuestion<FieldName> {...props} />;
}

function FormQuestion<FieldName>(props: FormQuestionProps<FieldName>) {
    const { name, showStop, description, stopMessage, showInfo, infoMessage, legend, children } = props;
    return (
        <FormBlock>
            {children || <FormikYesOrNoQuestion name={name} legend={legend} description={description} />}
            <div aria-live="polite">
                {showStop && stopMessage && <StopMessage>{stopMessage}</StopMessage>}
                {showInfo && infoMessage && <InfoMessage>{infoMessage}</InfoMessage>}
            </div>
        </FormBlock>
    );
}

export default FormQuestion;
