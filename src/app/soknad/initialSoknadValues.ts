import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SoknadFormData, SoknadFormField } from '../types/SoknadFormData';

export const initialSoknadFormData: SoknadFormData = {
    [SoknadFormField.harForståttRettigheterOgPlikter]: false,
    [SoknadFormField.harBekreftetOpplysninger]: false,
    [SoknadFormField.gjelderMidlertidigPgaKorona]: YesOrNo.UNANSWERED,
    [SoknadFormField.skalDeleMedAndreForelderSamboerEktefelle]: YesOrNo.UNANSWERED,
    [SoknadFormField.andreBarn]: [],
    [SoknadFormField.harAleneomsorg]: YesOrNo.UNANSWERED,
    [SoknadFormField.harAleneomsorgFor]: [],
    [SoknadFormField.harUtvidetRett]: YesOrNo.UNANSWERED,
    [SoknadFormField.harUtvidetRettFor]: [],
    [SoknadFormField.erYrkesaktiv]: YesOrNo.UNANSWERED,
    [SoknadFormField.arbeiderINorge]: YesOrNo.UNANSWERED,
    [SoknadFormField.arbeidssituasjon]: [],
    [SoknadFormField.harBruktOmsorgsdagerIÅr]: YesOrNo.UNANSWERED,
    [SoknadFormField.fnrMottaker]: '',
    [SoknadFormField.navnMottaker]: '',
    [SoknadFormField.samværsavtale]: [],
};
