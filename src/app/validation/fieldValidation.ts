import { createFieldValidationError } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';

export enum AppFieldValidationErrors {
    'fnr_lik_søkerFnr' = 'fieldvalidation.mottakersFnrErSøkersFnr',
}

export const validateFødselsnummerIsDifferentThan = (applicantFnr: string) => (fnr: string) => {
    if (hasValue(fnr) && applicantFnr === fnr.trim()) {
        return createFieldValidationError(AppFieldValidationErrors.fnr_lik_søkerFnr);
    }
    return undefined;
};
