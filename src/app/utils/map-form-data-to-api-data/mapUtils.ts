import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { AndreBarnApiData, BarnApiData } from '../../types/SoknadApiData';
import { Barn } from '../../types/SoknadFormData';

export const mapAnnetBarnToApiBarn = (annetBarn: AnnetBarn): AndreBarnApiData => {
    return {
        fnr: annetBarn.fnr,
        navn: annetBarn.navn,
        fødselsdato: formatDateToApiFormat(annetBarn.fødselsdato),
    };
};
export const mapBarnToApiBarn = (registrertBarn: Barn): BarnApiData => {
    return {
        ...registrertBarn,
        fødselsdato: formatDateToApiFormat(registrertBarn.fødselsdato),
    };
};
