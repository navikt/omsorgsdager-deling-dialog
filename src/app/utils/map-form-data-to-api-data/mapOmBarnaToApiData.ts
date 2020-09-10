import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { AndreBarnApiData, BarnApiData, SoknadApiData } from '../../types/SoknadApiData';
import { Barn, SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { mapAnnetBarnToApiBarn, mapBarnToApiBarn } from './mapUtils';

export type OmBarnaFormData = Pick<
    SoknadFormData,
    | SoknadFormField.harAleneomsorg
    | SoknadFormField.harAleneomsorgFor
    | SoknadFormField.harUtvidetRett
    | SoknadFormField.harUtvidetRettFor
>;

export type OmBarnaApiData = Pick<
    SoknadApiData,
    'harAleneomsorg' | 'harAleneomsorgFor' | 'harUtvidetRett' | 'harUtvidetRettFor' | 'andreBarn'
>;

const getBarnFromId = (
    fnrEllerAktørnr: string,
    andreBarn: AnnetBarn[] | undefined,
    barn: Barn[] | undefined
): BarnApiData | AndreBarnApiData => {
    const annetBarn = (andreBarn || []).find((barn) => barn.fnr === fnrEllerAktørnr);
    if (annetBarn) {
        return mapAnnetBarnToApiBarn(annetBarn);
    }
    const registrertBarn = (barn || []).find((barn) => barn.aktørId === fnrEllerAktørnr);
    if (registrertBarn) {
        return mapBarnToApiBarn(registrertBarn);
    }
    throw new Error('mapOmBarnaToApiData failed');
};

export const mapOmBarnaToApiData = (formData: SoknadFormData, barn: Barn[]): OmBarnaApiData => {
    return {
        harAleneomsorg: formData.harAleneomsorg === YesOrNo.YES,
        harAleneomsorgFor:
            formData.harAleneomsorg === YesOrNo.YES && formData.harAleneomsorgFor
                ? formData.harAleneomsorgFor.map((id) => getBarnFromId(id, formData.andreBarn, barn))
                : [],
        harUtvidetRett: formData.harUtvidetRett === YesOrNo.YES,
        harUtvidetRettFor:
            formData.harUtvidetRett === YesOrNo.YES && formData.harUtvidetRettFor
                ? formData.harUtvidetRettFor.map((id) => getBarnFromId(id, formData.andreBarn, barn))
                : [],
    };
};
