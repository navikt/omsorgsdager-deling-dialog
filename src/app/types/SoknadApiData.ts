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

export interface SoknadApiData {
    id: string;
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    barn: ApiBarn[];
    harAleneomsorg: boolean;
    harUtvidetRett: boolean;
    borINorge: boolean;
    arbeiderINorge: boolean;
    arbeidssituasjon: Arbeidssituasjon[];
    antallDagerBruktEtter1Juli?: number;
    mottakerType: Mottaker;
    mottakerFnr: string;
    mottakerNavn: string;
    antallDagerSomSkalOverføres: number;
}
