import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SoknadApiData, SoknadApiDataFieldCommon } from '../../types/SoknadApiData';
import { DinSituasjonFormData } from '../../types/SoknadFormData';

export type DinSituasjonApiData = Pick<
    SoknadApiData,
    | SoknadApiDataFieldCommon.erYrkesaktiv
    | SoknadApiDataFieldCommon.arbeiderINorge
    | SoknadApiDataFieldCommon.arbeidssituasjon
    | SoknadApiDataFieldCommon.antallDagerBruktEtter1Juli
>;

export const mapDinSituasjonToApiData = (formData: DinSituasjonFormData): DinSituasjonApiData => {
    return {
        erYrkesaktiv: formData.erYrkesaktiv === YesOrNo.YES,
        arbeiderINorge: formData.arbeiderINorge === YesOrNo.YES,
        arbeidssituasjon: formData.arbeidssituasjon,
        antallDagerBruktEtter1Juli:
            formData.harBruktOmsorgsdagerEtter1Juli === YesOrNo.YES && formData.antallDagerBruktEtter1Juli !== undefined
                ? formData.antallDagerBruktEtter1Juli
                : undefined,
    };
};
