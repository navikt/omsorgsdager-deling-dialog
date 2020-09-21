import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { yesOrNoIsAnswered } from '@navikt/sif-common-core/lib/utils/yesOrNoUtils';

export enum IntroFormField {
    'erArbeidstakerSnEllerFrilanser' = 'erArbeidstakerSnEllerFrilanser',
    'harAleneomsorg' = 'harAleneomsorg',
    'mottakerErIkkeEktefelleEllerSamboer' = 'mottakerErEktefelleEllerSamboer',
    'mottakersArbeidssituasjonErOk' = 'mottakersArbeidssituasjonErOk',
}

export interface IntroFormData {
    [IntroFormField.erArbeidstakerSnEllerFrilanser]: YesOrNo;
    [IntroFormField.harAleneomsorg]: YesOrNo;
    [IntroFormField.mottakerErIkkeEktefelleEllerSamboer]: YesOrNo;
    [IntroFormField.mottakersArbeidssituasjonErOk]: YesOrNo;
}

export const introFormInitialValues: Partial<IntroFormData> = {
    [IntroFormField.erArbeidstakerSnEllerFrilanser]: YesOrNo.UNANSWERED,
    [IntroFormField.harAleneomsorg]: YesOrNo.UNANSWERED,
    [IntroFormField.mottakerErIkkeEktefelleEllerSamboer]: YesOrNo.UNANSWERED,
    [IntroFormField.mottakersArbeidssituasjonErOk]: YesOrNo.UNANSWERED,
};

export enum IntroFormAvslag {
    erIkkeArbeidstakerSnEllerFrilanser = 'erIkkeArbeidstakerSnEllerFrilanser',
    harIkkeAleneomsorg = 'harIkkeAleneomsorg',
    mottakerErIkkeEktefelleEllerSamboer = 'mottakerErIkkeEktefelleEllerSamboer',
    mottakersArbeidssituasjonErIkkeOk = 'mottakersArbeidssituasjonErIkkeOk',
}

export const getIntroFormAvslag = ({
    erArbeidstakerSnEllerFrilanser,
    harAleneomsorg,
    mottakerErEktefelleEllerSamboer,
    mottakersArbeidssituasjonErOk,
}: IntroFormData): IntroFormAvslag | undefined => {
    if (erArbeidstakerSnEllerFrilanser === YesOrNo.NO) {
        return IntroFormAvslag.erIkkeArbeidstakerSnEllerFrilanser;
    }
    if (harAleneomsorg === YesOrNo.NO) {
        return IntroFormAvslag.harIkkeAleneomsorg;
    }
    if (mottakerErEktefelleEllerSamboer == YesOrNo.NO) {
        return IntroFormAvslag.mottakerErIkkeEktefelleEllerSamboer;
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
    [Q.mottakerErIkkeEktefelleEllerSamboer]: {
        parentQuestion: Q.harAleneomsorg,
        isIncluded: ({ harAleneomsorg, avslag }) =>
            yesOrNoIsAnswered(harAleneomsorg) && avslag !== IntroFormAvslag.harIkkeAleneomsorg,
        isAnswered: ({ mottakerErEktefelleEllerSamboer }) => yesOrNoIsAnswered(mottakerErEktefelleEllerSamboer),
    },
    [Q.mottakersArbeidssituasjonErOk]: {
        parentQuestion: Q.mottakerErIkkeEktefelleEllerSamboer,
        isIncluded: ({ mottakerErEktefelleEllerSamboer, avslag }) =>
            yesOrNoIsAnswered(mottakerErEktefelleEllerSamboer) &&
            avslag !== IntroFormAvslag.mottakerErIkkeEktefelleEllerSamboer,
        isAnswered: ({ mottakersArbeidssituasjonErOk }) => yesOrNoIsAnswered(mottakersArbeidssituasjonErOk),
    },
};

export const IntroFormQuestions = Questions<IntroFormQuestionsPayload, IntroFormField>(IntroFormConfig);
