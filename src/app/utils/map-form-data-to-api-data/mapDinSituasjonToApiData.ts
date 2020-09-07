import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';

export type DinSituasjonFormData = Pick<
    SoknadFormData,
    | SoknadFormField.arbeiderINorge
    | SoknadFormField.borINorge
    | SoknadFormField.arbeidssituasjon
    | SoknadFormField.harBruktOmsorgsdagerEtter1Juli
    | SoknadFormField.antallDagerBruktEtter1Juli
>;

export type DinSituasjonApiData = Pick<
    SoknadApiData,
    'arbeiderINorge' | 'borINorge' | 'arbeidssituasjon' | 'antallDagerHarBruktEtter1Juli'
>;

export const mapDinSituasjonToApiData = (formData: DinSituasjonFormData): DinSituasjonApiData => {
    return {
        arbeiderINorge: formData.arbeiderINorge === YesOrNo.YES,
        borINorge: formData.borINorge === YesOrNo.YES,
        arbeidssituasjon: formData.arbeidssituasjon,
        antallDagerHarBruktEtter1Juli:
            formData.harBruktOmsorgsdagerEtter1Juli === YesOrNo.YES && formData.antallDagerBruktEtter1Juli !== undefined
                ? formData.antallDagerBruktEtter1Juli
                : undefined,
    };
};
