import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Arbeidssituasjon, Mottaker } from './SoknadFormData';

export interface ApiBarn {
    identitetsnummer?: string;
    aktørId?: string;
    fødselsdato: ApiStringDate;
    navn: string;
    aleneOmOmsorgen: boolean;
    utvidetRett: boolean;
}

export type ApiBarnKorona = Omit<ApiBarn, 'aleneOmOmsorgen'>;

/** Ektefelle/samboer */
interface SoknadApiDataOverføring {
    mottakerType: Mottaker;
    antallDagerSomSkalOverføres: number;
    barn: ApiBarn[];
}
/** Samværsforelder */
interface SoknadApiDataFordeling {
    mottakerType: Mottaker;
    barn: ApiBarn[];
    samværsavtale: string[];
}
interface SoknadApiDataKorona {
    antallDagerSomSkalOverføres: number;
    barn: ApiBarnKorona[];
}

export interface SoknadApiData {
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
    overforing?: SoknadApiDataOverføring;
    fordeling?: SoknadApiDataFordeling;
    korona?: SoknadApiDataKorona;
}
