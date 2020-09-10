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
    andreBarn: AnnetBarn[],
    barn: Barn[]
): BarnApiData | AndreBarnApiData => {
    const annetBarn = andreBarn.find((barn) => barn.fnr === fnrEllerAktørnr);
    if (annetBarn) {
        return mapAnnetBarnToApiBarn(annetBarn);
    }
    const registrertBarn = barn.find((barn) => barn.aktørId === fnrEllerAktørnr);
    if (registrertBarn) {
        return mapBarnToApiBarn(registrertBarn);
    }
    throw new Error('mapOmBarnaToApiData failed');
};

export const mapOmBarnaToApiData = (
    { harAleneomsorg, harAleneomsorgFor, harUtvidetRett, harUtvidetRettFor, andreBarn }: SoknadFormData,
    barn: Barn[]
): OmBarnaApiData => {
    return {
        harAleneomsorg: harAleneomsorg === YesOrNo.YES,
        harAleneomsorgFor:
            harAleneomsorg === YesOrNo.YES ? harAleneomsorgFor.map((id) => getBarnFromId(id, andreBarn, barn)) : [],
        harUtvidetRett: harUtvidetRett === YesOrNo.YES,
        harUtvidetRettFor:
            harUtvidetRett === YesOrNo.YES ? harUtvidetRettFor.map((id) => getBarnFromId(id, andreBarn, barn)) : [],
    };
};
