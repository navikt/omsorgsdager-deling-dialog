import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { yesOrNoIsAnswered } from '../../../common/utils/yesOrNoUtils';

export enum IntroFormField {
    'erArbeidstakerSnEllerFrilanser' = 'erArbeidstakerSnEllerFrilanser',
    'harAleneomsorg' = 'harAleneomsorg',
    'mottakerErEktefelleEllerPartner' = 'mottakerErEktefelleEllerPartner',
    'mottakersArbeidssituasjonErOk' = 'mottakersArbeidssituasjonErOk',
}

export interface IntroFormData {
    [IntroFormField.erArbeidstakerSnEllerFrilanser]: YesOrNo;
    [IntroFormField.harAleneomsorg]: YesOrNo;
    [IntroFormField.mottakerErEktefelleEllerPartner]: YesOrNo;
    [IntroFormField.mottakersArbeidssituasjonErOk]: YesOrNo;
}

export const introFormInitialValues: Partial<IntroFormData> = {
    [IntroFormField.erArbeidstakerSnEllerFrilanser]: YesOrNo.UNANSWERED,
    [IntroFormField.harAleneomsorg]: YesOrNo.UNANSWERED,
    [IntroFormField.mottakerErEktefelleEllerPartner]: YesOrNo.UNANSWERED,
    [IntroFormField.mottakersArbeidssituasjonErOk]: YesOrNo.UNANSWERED,
};

export enum IntroFormAvslag {
    erIkkeArbeidstakerSnEllerFrilanser = 'erIkkeArbeidstakerSnEllerFrilanser',
    harIkkeAleneomsorg = 'harIkkeAleneomsorg',
    mottakerErIkkeEktefelleEllerPartner = 'mottakerErIkkeEktefelleEllerPartner',
    mottakersArbeidssituasjonErIkkeOk = 'mottakersArbeidssituasjonErIkkeOk',
}

export const getIntroFormAvslag = ({
    erArbeidstakerSnEllerFrilanser,
    harAleneomsorg,
    mottakerErEktefelleEllerPartner,
    mottakersArbeidssituasjonErOk,
}: IntroFormData): IntroFormAvslag | undefined => {
    if (erArbeidstakerSnEllerFrilanser === YesOrNo.NO) {
        return IntroFormAvslag.erIkkeArbeidstakerSnEllerFrilanser;
    }
    if (harAleneomsorg === YesOrNo.NO) {
        return IntroFormAvslag.harIkkeAleneomsorg;
    }
    if (mottakerErEktefelleEllerPartner == YesOrNo.NO) {
        return IntroFormAvslag.mottakerErIkkeEktefelleEllerPartner;
    }
    if (mottakersArbeidssituasjonErOk === YesOrNo.NO) {
        return IntroFormAvslag.mottakersArbeidssituasjonErIkkeOk;
    }
    return undefined;
};

const Q = IntroFormField;

type IntroFormQuestionsPayload = IntroFormData & { avslag: IntroFormAvslag | undefined };

const IntroFormConfig: QuestionConfig<IntroFormQuestionsPayload, IntroFormField> = {
    [Q.erArbeidstakerSnEllerFrilanser]: {
        isAnswered: ({ erArbeidstakerSnEllerFrilanser }) => yesOrNoIsAnswered(erArbeidstakerSnEllerFrilanser),
    },
    [Q.harAleneomsorg]: {
        parentQuestion: Q.erArbeidstakerSnEllerFrilanser,
        isIncluded: ({ erArbeidstakerSnEllerFrilanser, avslag }) =>
            yesOrNoIsAnswered(erArbeidstakerSnEllerFrilanser) &&
            avslag !== IntroFormAvslag.erIkkeArbeidstakerSnEllerFrilanser,
        isAnswered: ({ harAleneomsorg }) => yesOrNoIsAnswered(harAleneomsorg),
    },
    [Q.mottakerErEktefelleEllerPartner]: {
        parentQuestion: Q.harAleneomsorg,
        isIncluded: ({ harAleneomsorg, avslag }) =>
            yesOrNoIsAnswered(harAleneomsorg) && avslag !== IntroFormAvslag.harIkkeAleneomsorg,
        isAnswered: ({ mottakerErEktefelleEllerPartner }) => yesOrNoIsAnswered(mottakerErEktefelleEllerPartner),
    },
    [Q.mottakersArbeidssituasjonErOk]: {
        parentQuestion: Q.mottakerErEktefelleEllerPartner,
        isIncluded: ({ mottakerErEktefelleEllerPartner, avslag }) =>
            yesOrNoIsAnswered(mottakerErEktefelleEllerPartner) &&
            avslag !== IntroFormAvslag.mottakerErIkkeEktefelleEllerPartner,
        isAnswered: ({ mottakersArbeidssituasjonErOk }) => yesOrNoIsAnswered(mottakersArbeidssituasjonErOk),
    },
};

export const IntroFormQuestions = Questions<IntroFormQuestionsPayload, IntroFormField>(IntroFormConfig);
