import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { yesOrNoIsAnswered } from '@navikt/sif-common-core/lib/utils/yesOrNoUtils';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { QuestionConfig, Questions } from '@navikt/sif-common-question-config/lib';
import { isDateBefore2021 } from '../../utils/dateUtils';
import { Mottaker, SoknadFormData, SoknadFormField, Stengingsperiode } from '../../types/SoknadFormData';

export enum MottakerFormStopp {
    koronaAnnenMottaker = 'koronaAnnenMottaker',
    koronaAnnenStengingsperiode = 'koronaAnnenStengingsperiode',
}

export const getMottakerFormStopp = ({
    gjelderMidlertidigPgaKorona,
    skalDeleMedAndreForelderSamboerEktefelle,
    stengingsperiode,
}: SoknadFormData): MottakerFormStopp | undefined => {
    if (gjelderMidlertidigPgaKorona === YesOrNo.YES && skalDeleMedAndreForelderSamboerEktefelle === YesOrNo.NO) {
        return MottakerFormStopp.koronaAnnenMottaker;
    }
    if (gjelderMidlertidigPgaKorona === YesOrNo.YES && stengingsperiode === Stengingsperiode.annen) {
        return MottakerFormStopp.koronaAnnenStengingsperiode;
    }
    return undefined;
};

const Q = SoknadFormField;

export type MottakerFormQuestionsPayload = Partial<SoknadFormData>;

const navnOgFnrIsIncluded = ({
    gjelderMidlertidigPgaKorona,
    mottakerType,
    skalDeleMedAndreForelderSamboerEktefelle,
}: MottakerFormQuestionsPayload): boolean =>
    (gjelderMidlertidigPgaKorona === YesOrNo.NO && mottakerType !== undefined) ||
    (gjelderMidlertidigPgaKorona === YesOrNo.YES && skalDeleMedAndreForelderSamboerEktefelle === YesOrNo.YES);

const MottakerFormConfig: QuestionConfig<MottakerFormQuestionsPayload, SoknadFormField> = {
    [Q.gjelderMidlertidigPgaKorona]: {
        isAnswered: ({ gjelderMidlertidigPgaKorona }): boolean => yesOrNoIsAnswered(gjelderMidlertidigPgaKorona),
    },
    [Q.skalDeleMedAndreForelderSamboerEktefelle]: {
        isAnswered: ({ skalDeleMedAndreForelderSamboerEktefelle }): boolean =>
            yesOrNoIsAnswered(skalDeleMedAndreForelderSamboerEktefelle),
        isIncluded: ({ gjelderMidlertidigPgaKorona }): boolean => gjelderMidlertidigPgaKorona === YesOrNo.YES,
    },
    [Q.mottakerType]: {
        isAnswered: ({ mottakerType }): boolean => mottakerType !== undefined,
        isIncluded: ({ gjelderMidlertidigPgaKorona }): boolean => {
            return gjelderMidlertidigPgaKorona === YesOrNo.NO;
        },
    },
    [Q.fnrMottaker]: {
        isIncluded: navnOgFnrIsIncluded,
        isAnswered: ({ fnrMottaker }): boolean => hasValue(fnrMottaker),
    },
    [Q.navnMottaker]: {
        isIncluded: navnOgFnrIsIncluded,
        isAnswered: ({ navnMottaker }): boolean => hasValue(navnMottaker),
    },

    [Q.stengingsperiode]: {
        isAnswered: ({ stengingsperiode }): boolean => hasValue(stengingsperiode),
        isIncluded: ({ gjelderMidlertidigPgaKorona, skalDeleMedAndreForelderSamboerEktefelle }): boolean =>
            gjelderMidlertidigPgaKorona === YesOrNo.YES &&
            skalDeleMedAndreForelderSamboerEktefelle === YesOrNo.YES &&
            isDateBefore2021(),
    },

    [Q.antallDagerSomSkalOverføres]: {
        isAnswered: ({ antallDagerSomSkalOverføres }): boolean => hasValue(antallDagerSomSkalOverføres),
        isIncluded: ({
            gjelderMidlertidigPgaKorona,
            stengingsperiode,
            mottakerType,
            skalDeleMedAndreForelderSamboerEktefelle,
        }): boolean => {
            return (
                (gjelderMidlertidigPgaKorona === YesOrNo.NO &&
                    mottakerType !== undefined &&
                    mottakerType !== Mottaker.samværsforelder) ||
                (gjelderMidlertidigPgaKorona === YesOrNo.YES &&
                    skalDeleMedAndreForelderSamboerEktefelle === YesOrNo.YES &&
                    stengingsperiode !== Stengingsperiode.annen)
            );
        },
    },
};

export const MottakerFormQuestions = Questions<MottakerFormQuestionsPayload, SoknadFormField>(MottakerFormConfig);
