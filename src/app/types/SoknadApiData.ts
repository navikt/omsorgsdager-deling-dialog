import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Arbeidssituasjon, Mottaker } from './SoknadFormData';

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
}

export interface SoknadApiDataBase {
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

export interface SøknadKoronaoverføring extends SoknadApiDataBase {
    korona: SøknadApiDataKorona;
}
export interface SøknadOverføring extends SoknadApiDataBase {
    overføring: SøknadApiDataOverføring;
}
export interface SøknadFordeling extends SoknadApiDataBase {
    fordeling: SøknadApiDataFordeling;
}

export type SoknadApiData = SøknadKoronaoverføring | SøknadFordeling | SøknadOverføring;

export const isSøknadKoronaoverføring = (søknad: any): søknad is SøknadApiDataKorona => {
    return søknad.korona !== undefined;
};
export const isSøknadFordeling = (søknad: any): søknad is SøknadApiDataFordeling => {
    return søknad.fordeling !== undefined;
};
export const isSøknadOverføring = (søknad: any): søknad is SøknadApiDataOverføring => {
    return søknad.overføring !== undefined;
};
