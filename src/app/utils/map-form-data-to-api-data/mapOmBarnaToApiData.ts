/* import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SoknadApiData, BarnApiData } from '../../types/SoknadApiData';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';

export type OmBarnaFormData = Pick<
    SoknadFormData,
    | SoknadFormField.harAleneomsorg
    | SoknadFormField.harAleneomsorgFor
    | SoknadFormField.harUtvidetRett
    | SoknadFormField.harUtvidetRettFor
    | SoknadFormField.andreBarn
>;

export type OmBarnaApiData = Pick<
    SoknadApiData,
    'harAleneomsorg' | 'harAleneomsorgFor' | 'harUtvidetRett' | 'harUtvidetRettFor' | 'andreBarn'
>;

const getAleneOmsorgFor = (value: string, formData: OmBarnaFormData, barn: BarnApiData[]) => {
    if (formData.andreBarn.find((barn) => barn.fnr === value)) {
        return formData.andreBarn.filter((barn) => barn.fnr === value);
    } else if (barn.find((barnet) => barnet.aktørId === value)) {
        return barn.filter((barnet) => barnet.aktørId === value);
    } else return [];
};

export const mapOmBarnaToApiData = (formData: OmBarnaFormData, barn: BarnApiData[]): OmBarnaApiData => {
    return {
        harAleneomsorg: formData.harAleneomsorg === YesOrNo.YES,
          harAleneomsorgFor:
            formData.harAleneomsorg === YesOrNo.YES
                ? formData.harAleneomsorgFor.map((id) => getAleneOmsorgFor(id, formData, barn))
                : [], 
        harUtvidetRett: formData.harUtvidetRett === YesOrNo.YES,
         harUtvidetRettFor: formData.harUtvidetRett === YesOrNo.YES ? formData.harUtvidetRettFor : undefined,
    };
};
*/
