import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';

export enum AppFieldValidationErrors {
    'samtykkeErPåkrevd' = 'fieldvalidation.samtykkeErPåkrevd',
}

export const createAppFieldValidationError = (error: AppFieldValidationErrors, values?: any): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors>(error, values);
};

export const validateSamtykke = (value: boolean) => {
    if (value !== true) {
        return createAppFieldValidationError(AppFieldValidationErrors.samtykkeErPåkrevd);
    }
    return undefined;
};
