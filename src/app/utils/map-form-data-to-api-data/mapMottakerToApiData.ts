import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData, SoknadFormField, Mottaker } from '../../types/SoknadFormData';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export type MottakerFormData = Pick<
    SoknadFormData,
    | SoknadFormField.overføreTilEktefelle
    | SoknadFormField.overføreTilSamboer
    | SoknadFormField.fnrMottaker
    | SoknadFormField.navnMottaker
    | SoknadFormField.antallDagerSomSkalOverføres
>;

export type MottakerApiData = Pick<
    SoknadApiData,
    'mottakerType' | 'mottakerFnr' | 'mottakerNavn' | 'antallDagerSomSkalOverføres'
>;

export const mapMottakerToApiData = (formData: MottakerFormData): MottakerApiData => {
    return {
        antallDagerSomSkalOverføres: formData.antallDagerSomSkalOverføres,
        mottakerType: formData.overføreTilEktefelle === YesOrNo.YES ? Mottaker.ektefelle : Mottaker.samboer,
        mottakerFnr: formData.fnrMottaker,
        mottakerNavn: formData.navnMottaker,
    };
};
