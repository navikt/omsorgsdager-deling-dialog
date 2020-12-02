import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Mottaker, SoknadFormData } from './SoknadFormData';

export enum Søknadstype {
    'overføring' = 'overføring',
    'fordeling' = 'fordeling',
    'korona' = 'korona',
}

export const getSøknadstype = (formData: SoknadFormData): Søknadstype | undefined => {
    if (formData.gjelderMidlertidigPgaKorona === YesOrNo.YES) {
        return Søknadstype.korona;
    }
    if (formData.gjelderMidlertidigPgaKorona === YesOrNo.NO) {
        if (formData.mottakerType === Mottaker.ektefelle || formData.mottakerType === Mottaker.samboer) {
            return Søknadstype.overføring;
        }
        if (formData.mottakerType === Mottaker.samværsforelder) {
            return Søknadstype.fordeling;
        }
    }
    return undefined;
};
