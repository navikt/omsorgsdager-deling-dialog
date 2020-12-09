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

export enum SoknadApiDataFieldCommon {
    'id' = 'id',
    'type' = 'type',
    'språk' = 'språk',
    'harForståttRettigheterOgPlikter' = 'harForståttRettigheterOgPlikter',
    'harBekreftetOpplysninger' = 'harBekreftetOpplysninger',
    'mottakerFnr' = 'mottakerFnr',
    'mottakerNavn' = 'mottakerNavn',
    'harAleneomsorg' = 'harAleneomsorg',
    'harUtvidetRett' = 'harUtvidetRett',
    'erYrkesaktiv' = 'erYrkesaktiv',
    'arbeiderINorge' = 'arbeiderINorge',
    'arbeidssituasjon' = 'arbeidssituasjon',
    'antallDagerBruktEtter1Juli' = 'antallDagerBruktEtter1Juli',
    'barn' = 'barn',
}

export enum SoknadApiDataFieldKorona {
    'korona' = 'korona',
}
export enum SoknadApiDataFieldFordeling {
    'fordeling' = 'fordeling',
}
export enum SoknadApiDataFieldOverføring {
    'overføring' = 'overføring',
}

export interface SoknadApiDataFelles {
    [SoknadApiDataFieldCommon.id]: string;
    [SoknadApiDataFieldCommon.type]: Søknadstype;
    [SoknadApiDataFieldCommon.språk]: Locale;
    [SoknadApiDataFieldCommon.harForståttRettigheterOgPlikter]: boolean;
    [SoknadApiDataFieldCommon.harBekreftetOpplysninger]: boolean;
    [SoknadApiDataFieldCommon.mottakerFnr]: string;
    [SoknadApiDataFieldCommon.mottakerNavn]: string;
    [SoknadApiDataFieldCommon.harAleneomsorg]: boolean;
    [SoknadApiDataFieldCommon.harUtvidetRett]: boolean;
    [SoknadApiDataFieldCommon.erYrkesaktiv]: boolean;
    [SoknadApiDataFieldCommon.arbeiderINorge]: boolean;
    [SoknadApiDataFieldCommon.arbeidssituasjon]: Arbeidssituasjon[];
    [SoknadApiDataFieldCommon.antallDagerBruktEtter1Juli]?: number;
    [SoknadApiDataFieldCommon.barn]: ApiBarn[];
}

export interface SøknadKoronaoverføringApiData extends SoknadApiDataFelles {
    [SoknadApiDataFieldCommon.type]: Søknadstype.koronaoverføring;
    [SoknadApiDataFieldKorona.korona]: SøknadApiDataKorona;
}
export const isSøknadKoronaoverføring = (søknad: any): søknad is SøknadKoronaoverføringApiData => {
    return søknad.type === Søknadstype.koronaoverføring;
};
export interface SøknadOverføringApiData extends SoknadApiDataFelles {
    [SoknadApiDataFieldCommon.type]: Søknadstype.overføring;
    [SoknadApiDataFieldOverføring.overføring]: SøknadApiDataOverføring;
}
export const isSøknadOverføring = (søknad: any): søknad is SøknadOverføringApiData => {
    return søknad.type === Søknadstype.overføring;
};
export interface SøknadFordelingApiData extends SoknadApiDataFelles {
    [SoknadApiDataFieldCommon.type]: Søknadstype.fordeling;
    [SoknadApiDataFieldFordeling.fordeling]: SøknadApiDataFordeling;
}
export const isSøknadFordeling = (søknad: any): søknad is SøknadFordelingApiData => {
    return søknad.type === Søknadstype.fordeling;
};

export type SoknadApiData = SøknadKoronaoverføringApiData | SøknadFordelingApiData | SøknadOverføringApiData;
