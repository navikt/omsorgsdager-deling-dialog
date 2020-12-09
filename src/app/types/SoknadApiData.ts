import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Arbeidssituasjon, Mottaker } from './SoknadFormData';
import { Søknadstype } from './Soknadstype';

export interface ApiBarn {
    identitetsnummer?: string;
    aktørId?: string;
    fødselsdato: ApiStringDate;
    navn: string;
    aleneOmOmsorgen?: boolean;
    utvidetRett: boolean;
}
export interface BarnStepApiData {
    harAleneomsorg: boolean;
    harUtvidetRett: boolean;
    barn: ApiBarn[];
}
export interface StengingsperiodeAPI {
    fraOgMed: string;
    tilOgMed: string;
}

/** Ektefelle/samboer */
interface SøknadApiDataOverføring {
    mottakerType: Mottaker;
    antallDagerSomSkalOverføres: number;
}
/** Samværsforelder */
interface SøknadApiDataFordeling {
    mottakerType: Mottaker;
    samværsavtale: string[];
}
interface SøknadApiDataKorona {
    antallDagerSomSkalOverføres: number;
    stengingsperiode: StengingsperiodeAPI;
}

export interface SoknadApiDataFelles {
    id: string;
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    mottakerFnr: string;
    mottakerNavn: string;
    harAleneomsorg: boolean;
    harUtvidetRett: boolean;
    erYrkesaktiv: boolean;
    arbeiderINorge: boolean;
    arbeidssituasjon: Arbeidssituasjon[];
    antallDagerBruktEtter1Juli?: number;
    barn: ApiBarn[];
}

export interface SøknadKoronaoverføringApiData extends SoknadApiDataFelles {
    type: Søknadstype.koronaoverføring;
    korona: SøknadApiDataKorona;
}
export const isSøknadKoronaoverføring = (søknad: any): søknad is SøknadKoronaoverføringApiData => {
    return søknad.type === Søknadstype.koronaoverføring;
};
export interface SøknadOverføringApiData extends SoknadApiDataFelles {
    type: Søknadstype.overføring;
    overføring: SøknadApiDataOverføring;
}
export const isSøknadOverføring = (søknad: any): søknad is SøknadOverføringApiData => {
    return søknad.type === Søknadstype.overføring;
};
export interface SøknadFordelingApiData extends SoknadApiDataFelles {
    type: Søknadstype.fordeling;
    fordeling: SøknadApiDataFordeling;
}
export const isSøknadFordeling = (søknad: any): søknad is SøknadFordelingApiData => {
    return søknad.type === Søknadstype.fordeling;
};

export type SoknadApiData = SøknadKoronaoverføringApiData | SøknadFordelingApiData | SøknadOverføringApiData;
