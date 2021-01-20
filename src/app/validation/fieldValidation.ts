import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';

export enum AppFieldValidationErrors {
    'fnr_lik_søkerFnr' = 'fieldvalidation.mottakersFnrErSøkersFnr',
    'samlet_storrelse_for_hoy' = 'fieldvalidation.samlet_storrelse_for_hoy',
    'for_mange_dokumenter' = 'fieldvalidation.for_mange_dokumenter',
}

export const validateFødselsnummerIsDifferentThan = (applicantFnr: string) => (
    fnr: string
): FieldValidationResult | undefined => {
    if (hasValue(fnr) && applicantFnr === fnr.trim()) {
        return createFieldValidationError(AppFieldValidationErrors.fnr_lik_søkerFnr);
    }
    return undefined;
};

export const validateDocuments = (attachments: Attachment[]): FieldValidationResult => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    const totalSizeInBytes: number = getTotalSizeOfAttachments(attachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return createFieldValidationError(AppFieldValidationErrors.samlet_storrelse_for_hoy);
    }
    if (uploadedAttachments.length > 100) {
        return createFieldValidationError(AppFieldValidationErrors.for_mange_dokumenter);
    }
    return undefined;
};
