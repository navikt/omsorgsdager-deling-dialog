import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SoknadApiData } from '../../types/SoknadApiData';
import { Mottaker, MottakerFormData } from '../../types/SoknadFormData';

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
