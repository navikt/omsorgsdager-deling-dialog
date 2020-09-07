import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum Arbeidssituasjon {
    'arbeidstaker' = 'arbeidstaker',
    'selvstendigNæringsdrivende' = 'selvstendigNæringsdrivende',
    'frilanser' = 'frilanser',
    'annen' = 'annen',
}

export enum Mottaker {
    'ektefelle' = 'ektefelle',
    'samboer' = 'samboer',
    'annen' = 'annen',
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
    arbeiderINorge = 'arbeiderINorge',
    arbeidssituasjon = 'arbeidssituasjon',
    harBruktOmsorgsdagerEtter1Juli = 'harBruktOmsorgsdagerEtter1Juli',
    antallDagerBruktEtter1Juli = 'antallDagerBruktEtter1Juli',
    harDeltDagerMedAndreTidligere = 'harDeltDagerMedAndreTidligere',
    antallDagerHarDeltMedAndre = 'antallDagerHarDeltMedAndre',
    overføreTilEktefelle = 'overføreTilEktefelle',
    overføreTilPartner = 'overføreTilPartner',
    fnrMottaker = 'fnrMottaker',
    navnMottaker = 'navnMottaker',
    antallDagerSomSkalOverføres = 'antallDagerSomSkalOverføres',
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
    [SoknadFormField.arbeiderINorge]: YesOrNo;
    [SoknadFormField.arbeidssituasjon]: Arbeidssituasjon[];
    [SoknadFormField.harBruktOmsorgsdagerEtter1Juli]: YesOrNo;
    [SoknadFormField.antallDagerBruktEtter1Juli]?: number;
    [SoknadFormField.harDeltDagerMedAndreTidligere]: YesOrNo;
    [SoknadFormField.antallDagerHarDeltMedAndre]: number;
    [SoknadFormField.overføreTilEktefelle]: YesOrNo;
    [SoknadFormField.overføreTilPartner]: YesOrNo;
    [SoknadFormField.fnrMottaker]: string;
    [SoknadFormField.navnMottaker]: string;
    [SoknadFormField.antallDagerSomSkalOverføres]: number;
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
    [SoknadFormField.arbeiderINorge]: YesOrNo.UNANSWERED,
    [SoknadFormField.arbeidssituasjon]: [],
    [SoknadFormField.harBruktOmsorgsdagerEtter1Juli]: YesOrNo.UNANSWERED,
    [SoknadFormField.harDeltDagerMedAndreTidligere]: YesOrNo.UNANSWERED,
    [SoknadFormField.overføreTilEktefelle]: YesOrNo.UNANSWERED,
    [SoknadFormField.overføreTilPartner]: YesOrNo.UNANSWERED,
    [SoknadFormField.fnrMottaker]: '',
    [SoknadFormField.navnMottaker]: '',
    [SoknadFormField.harBekreftetMottakerOpplysninger]: false,
};
