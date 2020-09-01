import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum Arbeidssituasjon {
    'arbeidstaker' = 'arbeidstaker',
    'selvstendigNæringsdrivende' = 'selvstendigNæringsdrivende',
    'frilanser' = 'frilanser',
}

export enum OverforeTilType {
    'nyEktefelle' = 'nyEktefelle',
    'nySamboerHarBoddSammenMinst12maneder' = 'nySamboerHarBoddSammenMinst12maneder',
    'annenPerson' = 'annenPerson',
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    andreBarn = 'andreBarn',
    harAleneomsorg = 'harAleneomsorg',
    harAleneomsorgFor = 'harAleneomsorgFor',
    harUtvidetRett = 'harUtvidetRett',
    harUtvidetRettFor = 'harUtvidetRettFor',
    borINorge = 'borINorge',
    arbeidINorge = 'arbeidINorge',
    arbeidssituasjon = 'arbeidssituasjon',
    antallDagerHarBruktEtter1Juli = 'antallDagerHarBruktEtter1Juli',
    harDeltDagerMedAndreTidligere = 'harDeltDagerMedAndreTidligere',
    antallDagerHarDeltMedAndre = 'antallDagerHarDeltMedAndre',
    overforeTilType = 'overforeTilType',
    fnrMottaker = 'fnrMottaker',
    navnMottaker = 'navnMottaker',
    antallDagerTilOverfore = 'antallDagerTilOverfore',
    harBekreftetMottakerOpplysninger = 'harBekreftetMottakerOpplysninger',
}

export interface AndreBarn {
    fnr: string;
    ingenFnr: boolean;
    navn: string;
}

export interface Barn {
    fornavn: string;
    etternavn: string;
    mellomnavn?: string;
    aktørId: string;
    fødselsdato: Date;
}

export interface SoknadFormData {
    [SoknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SoknadFormField.harBekreftetOpplysninger]: boolean;
    [SoknadFormField.andreBarn]: AndreBarn[];
    [SoknadFormField.harAleneomsorg]: YesOrNo;
    [SoknadFormField.harAleneomsorgFor]: Array<Barn | AndreBarn>;
    [SoknadFormField.harUtvidetRett]: YesOrNo;
    [SoknadFormField.harUtvidetRettFor]: Array<Barn | AndreBarn>;
    [SoknadFormField.borINorge]: YesOrNo;
    [SoknadFormField.arbeidINorge]: YesOrNo;
    [SoknadFormField.arbeidssituasjon]: Arbeidssituasjon[];
    [SoknadFormField.antallDagerHarBruktEtter1Juli]: number;
    [SoknadFormField.harDeltDagerMedAndreTidligere]: YesOrNo;
    [SoknadFormField.antallDagerHarDeltMedAndre]: number;
    [SoknadFormField.overforeTilType]: OverforeTilType;
    [SoknadFormField.fnrMottaker]: string;
    [SoknadFormField.navnMottaker]: string;
    [SoknadFormField.antallDagerTilOverfore]: number;
    [SoknadFormField.harBekreftetMottakerOpplysninger]: boolean;
}

export const initialSoknadFormData: Partial<SoknadFormData> = {
    [SoknadFormField.harForståttRettigheterOgPlikter]: false,
    [SoknadFormField.harBekreftetOpplysninger]: false,
    [SoknadFormField.andreBarn]: [],
    [SoknadFormField.harAleneomsorg]: YesOrNo.UNANSWERED,
    [SoknadFormField.harAleneomsorgFor]: [],
    [SoknadFormField.harUtvidetRett]: YesOrNo.UNANSWERED,
    [SoknadFormField.harUtvidetRettFor]: [],
    [SoknadFormField.borINorge]: YesOrNo.UNANSWERED,
    [SoknadFormField.arbeidINorge]: YesOrNo.UNANSWERED,
    [SoknadFormField.arbeidssituasjon]: [],
    [SoknadFormField.harDeltDagerMedAndreTidligere]: YesOrNo.UNANSWERED,
    [SoknadFormField.fnrMottaker]: '',
    [SoknadFormField.navnMottaker]: '',
    [SoknadFormField.harBekreftetMottakerOpplysninger]: false,
};
