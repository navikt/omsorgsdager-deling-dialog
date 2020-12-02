import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import SoknadFormStep from '../SoknadFormStep';
import { StepID } from '../soknadStepsConfig';
import { useFormikContext } from 'formik';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormikFileUploader from '../../components/formik-file-uploader/FormikFileUploader';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FileUploadErrors from '@navikt/sif-common-core/lib/components/file-upload-errors/FileUploadErrors';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import UploadedDocumentsList from '../../components/uploaded-documents-list/UploadedDocumentsList';
import { validateDocuments } from '../../validation/fieldValidation';
import { relocateToLoginPage } from '../../utils/navigationUtils';

const SamværsavtaleStep = () => {
    const intl = useIntl();
    const { values } = useFormikContext<SoknadFormData>();
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const hasPendingUploads: boolean = (values.samværsavtale || []).find((a) => a.pending === true) !== undefined;
    const totalSize = getTotalSizeOfAttachments(values.samværsavtale);
    const sizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SoknadFormStep id={StepID.SAMVÆRSAVTALE} buttonDisabled={hasPendingUploads || sizeOver24Mb}>
            <CounsellorPanel>
                <p>{intlHelper(intl, 'step.samværsavtale.info.title')}</p>
                {intlHelper(intl, 'step.samværsavtale.info')}
            </CounsellorPanel>

            {totalSize <= MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <FormBlock>
                    <FormikFileUploader
                        name={SoknadFormField.samværsavtale}
                        label={intlHelper(intl, 'step.samværsavtale.vedlegg')}
                        onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                        onFileInputClick={() => {
                            setFilesThatDidntGetUploaded([]);
                        }}
                        onUnauthorizedOrForbiddenUpload={() => relocateToLoginPage()}
                        validate={validateDocuments}
                    />
                </FormBlock>
            )}

            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin={'l'}>
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'step.samværsavtale.advarsel.totalstørrelse'} />
                    </AlertStripeAdvarsel>
                </Box>
            )}

            <Box margin="m">
                <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            </Box>
            <Box margin="l">
                <UploadedDocumentsList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
            </Box>
        </SoknadFormStep>
    );
};

export default SamværsavtaleStep;
