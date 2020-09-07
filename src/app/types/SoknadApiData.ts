import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Arbeidssituasjon, Mottaker } from './SoknadFormData';
import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';

export interface AndreBarnApiData {
    fnr: string;
    ingenFnr: boolean;
    navn: string;
}

export interface BarnApiData {
    fornavn: string;
    etternavn: string;
    mellomnavn?: string;
    aktørId: string;
    fødselsdato: ApiStringDate;
}

export interface SoknadApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    andreBarn: AndreBarnApiData[];
    harAleneomsorg: boolean;
    harAleneomsorgFor: Array<BarnApiData | AndreBarnApiData>;
    harUtvidetRett: boolean;
    harUtvidetRettFor: Array<BarnApiData | AndreBarnApiData>;
    borINorge: boolean;
    arbeiderINorge: boolean;
    arbeidssituasjon: Arbeidssituasjon[];
    antallDagerHarBruktEtter1Juli?: number;
    harDeltDagerMedAndreTidligere: boolean;
    antallDagerHarDeltMedAndre: number;
    overforeTilType: Mottaker;
    fnrMottaker: string;
    navnMottaker: string;
    antallDagerTilOverfore: number;
    harBekreftetMottakerOpplysninger: boolean;
}
