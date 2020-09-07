import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

export enum AppFieldValidationErrors {
    'samtykkeErPåkrevd' = 'fieldvalidation.samtykkeErPåkrevd',
    'fnr_lik_søkerFnr' = 'fieldvalidation.mottakersFnrErSøkersFnr',
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

export const validateFødselsnummerIsDifferentThan = (applicantFnr: string) => (fnr: string) => {
    if (hasValue(fnr) && applicantFnr === fnr.trim()) {
        return createFieldValidationError(AppFieldValidationErrors.fnr_lik_søkerFnr);
    }
    return undefined;
};
