import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { AnnetBarn } from '@navikt/sif-common-forms/lib/annet-barn/types';
import { SoknadApiData, BarnOgAndreBarnApiData } from '../../types/SoknadApiData';
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
    'harAleneomsorg' | 'harAleneomsorgFor' | 'harUtvidetRett' | 'harUtvidetRettFor'
>;

const getBarnOgAndreBarn = (stringArray: string[], barn: Barn[], andreBarn: AnnetBarn[]): BarnOgAndreBarnApiData => {
    const barnOgAndreBarn: BarnOgAndreBarnApiData = { barn: [], andreBarn: [] };

    stringArray.map((id) => {
        const registrertBarn = barn.find((barn) => barn.aktørId === id);
        const annetBarn = andreBarn.find((barn) => barn.fnr === id);
        if (registrertBarn) {
            barnOgAndreBarn.barn.push(mapBarnToApiBarn(registrertBarn));
        } else if (annetBarn) {
            barnOgAndreBarn.andreBarn.push(mapAnnetBarnToApiBarn(annetBarn));
        } else throw new Error('mapOmBarnaToApiData failed');
    });

    return barnOgAndreBarn;
};

export const mapOmBarnaToApiData = (
    { harAleneomsorg, harAleneomsorgFor, harUtvidetRett, harUtvidetRettFor, andreBarn }: SoknadFormData,
    barn: Barn[]
): OmBarnaApiData => {
    return {
        harAleneomsorg: harAleneomsorg === YesOrNo.YES,
        harAleneomsorgFor:
            harAleneomsorg === YesOrNo.YES
                ? getBarnOgAndreBarn(harAleneomsorgFor, barn, andreBarn)
                : { barn: [], andreBarn: [] },
        harUtvidetRett: harUtvidetRett === YesOrNo.YES,
        harUtvidetRettFor:
            harUtvidetRett === YesOrNo.YES
                ? getBarnOgAndreBarn(harUtvidetRettFor, barn, andreBarn)
                : { barn: [], andreBarn: [] },
    };
};
