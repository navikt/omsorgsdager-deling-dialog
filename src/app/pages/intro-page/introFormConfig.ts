import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Arbeidssituasjon } from '../../types/SoknadFormData';

export enum IntroFormField {
    'erArbeidstakerSnEllerFrilanser' = 'erArbeidstakerSnEllerFrilanser',
    'harAleneomsorg' = 'harAleneomsorg',
    'mottakerErEktefelleEllerPartner' = 'mottakerErEktefelleEllerPartner',
    'arbeidssituasjonMottaker' = 'arbeidssituasjonMottaker',
}

export interface IntroFormData {
    [IntroFormField.erArbeidstakerSnEllerFrilanser]: YesOrNo;
    [IntroFormField.harAleneomsorg]: YesOrNo;
    [IntroFormField.mottakerErEktefelleEllerPartner]: YesOrNo;
    [IntroFormField.arbeidssituasjonMottaker]: Arbeidssituasjon[];
}

export const introFormInitialValues: Partial<IntroFormData> = {
    [IntroFormField.erArbeidstakerSnEllerFrilanser]: YesOrNo.UNANSWERED,
    [IntroFormField.harAleneomsorg]: YesOrNo.UNANSWERED,
    [IntroFormField.mottakerErEktefelleEllerPartner]: YesOrNo.UNANSWERED,
    [IntroFormField.arbeidssituasjonMottaker]: [],
};
