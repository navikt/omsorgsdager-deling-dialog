import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Mottaker, SoknadFormData } from './SoknadFormData';

export enum Soknadstype {
    'overføring' = 'overføring',
    'fordeling' = 'fordeling',
    'korona' = 'korona',
}

export const getSoknadstype = (formData: SoknadFormData): Soknadstype | undefined => {
    if (formData.gjelderMidlertidigPgaKorona === YesOrNo.YES) {
        return Soknadstype.korona;
    }
    if (formData.gjelderMidlertidigPgaKorona === YesOrNo.NO) {
        if (formData.mottakerType === Mottaker.ektefelle || formData.mottakerType === Mottaker.samboer) {
            return Soknadstype.overføring;
        }
        if (formData.mottakerType === Mottaker.samværsforelder) {
            return Soknadstype.fordeling;
        }
    }
    return undefined;
};
