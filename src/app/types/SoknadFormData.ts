import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum Arbeidssituasjon {
    'arbeidstaker' = 'arbeidstaker',
    'selvstendigNæringsdrivende' = 'selvstendigNæringsdrivende',
    'frilanser' = 'frilanser',
}

export enum OverforeTilType {
    'nyEktefelle' = 'nyEktefelle',
    'nySamboerHarBoddMinst12maneder' = 'nySamboerHarBoddMinst12maneder',
    'annenPerson' = 'annenPerson',
}

export enum SoknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    andreBarn = 'andreBarn',
    harAleneOmsorgen = 'harAleneOmsorgen',
    harAleneOmsorgFor = 'harAleneOmsorgFor',
    harUtvidetRett = 'harUtvidetRett',
    harUtvidetRettFor = 'harUtvidetRettFor',
    borINorge = 'borINorge',
    arbeidINorge = 'arbeidINorge',
    arbeidssituasjon = 'arbeidssituasjon',
    antallDagerHarBruktEtter1Juli = 'antallDagerHarBruktEtter1Juli',
    harDeltDagerMedAndreTiligere = 'harDeltDagerMedAndreTiligere',
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
    [SoknadFormField.harAleneOmsorgen]: YesOrNo;
    [SoknadFormField.harAleneOmsorgFor]: Array<Barn | AndreBarn>;
    [SoknadFormField.harUtvidetRett]: YesOrNo;
    [SoknadFormField.harUtvidetRettFor]: Array<Barn | AndreBarn>;
    [SoknadFormField.borINorge]: YesOrNo;
    [SoknadFormField.arbeidINorge]: YesOrNo;
    [SoknadFormField.arbeidssituasjon]: Arbeidssituasjon[];
    [SoknadFormField.antallDagerHarBruktEtter1Juli]: number;
    [SoknadFormField.harDeltDagerMedAndreTiligere]: YesOrNo;
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
    [SoknadFormField.harAleneOmsorgen]: YesOrNo.UNANSWERED,
    [SoknadFormField.harAleneOmsorgFor]: [],
    [SoknadFormField.harUtvidetRett]: YesOrNo.UNANSWERED,
    [SoknadFormField.harUtvidetRettFor]: [],
    [SoknadFormField.borINorge]: YesOrNo.UNANSWERED,
    [SoknadFormField.arbeidINorge]: YesOrNo.UNANSWERED,
    [SoknadFormField.arbeidssituasjon]: [],
    [SoknadFormField.harDeltDagerMedAndreTiligere]: YesOrNo.UNANSWERED,
    [SoknadFormField.fnrMottaker]: '',
    [SoknadFormField.navnMottaker]: '',
    [SoknadFormField.harBekreftetMottakerOpplysninger]: false,
};
