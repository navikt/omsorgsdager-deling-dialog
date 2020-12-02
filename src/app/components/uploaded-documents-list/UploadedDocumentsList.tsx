import * as React from 'react';
import { useFormikContext } from 'formik';
import AttachmentListWithDeletion from '@navikt/sif-common-core/lib/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from '@navikt/sif-common-core/lib/components/attachment-list/AttachmentList';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    containsAnyUploadedAttachments,
    fileExtensionIsValid,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { removeElementFromArray } from '@navikt/sif-common-core/lib/utils/listUtils';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import api from '../../api/api';

interface Props {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

const UploadedDocumentsList = ({ includeDeletionFunctionality }: Props) => {
    const { values, setFieldValue } = useFormikContext<SoknadFormData>();

    const dokumenter: Attachment[] = values.samværsavtale.filter(({ file }: Attachment) =>
        fileExtensionIsValid(file.name)
    );

    if (!containsAnyUploadedAttachments(dokumenter)) {
        return null;
    }

    if (includeDeletionFunctionality) {
        return (
            <AttachmentListWithDeletion
                attachments={dokumenter}
                onRemoveAttachmentClick={(attachment: Attachment) => {
                    attachment.pending = true;
                    setFieldValue(SoknadFormField.samværsavtale, dokumenter);
                    if (attachment.url) {
                        api.deleteFile(attachment.url).then(
                            () => {
                                setFieldValue(
                                    SoknadFormField.samværsavtale,
                                    removeElementFromArray(attachment, dokumenter)
                                );
                            },
                            () => {
                                setFieldValue(
                                    SoknadFormField.samværsavtale,
                                    removeElementFromArray(attachment, dokumenter)
                                );
                            }
                        );
                    }
                }}
            />
        );
    } else {
        return <AttachmentList attachments={dokumenter} />;
    }
};

export default UploadedDocumentsList;
