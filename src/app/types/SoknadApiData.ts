import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

export interface SoknadApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
}
