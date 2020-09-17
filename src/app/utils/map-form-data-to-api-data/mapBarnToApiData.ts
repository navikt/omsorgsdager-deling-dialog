import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ApiBarn } from '../../types/SoknadApiData';
import { Barn, SoknadFormData } from '../../types/SoknadFormData';
import { mapAnnetBarnToApiBarn, mapBarnToApiBarn } from './mapUtils';
import moment from 'moment';

export interface BarnApiData {
    harAleneomsorg: boolean;
    harUtvidetRett: boolean;
    barn: ApiBarn[];
}

const sortBarnByFødseldsdato = (barn1: ApiBarn, barn2: ApiBarn) => {
    if (moment(apiStringDateToDate(barn1.fødselsdato)).isSameOrBefore(apiStringDateToDate(barn2.fødselsdato))) {
        return -1;
    }
    return 1;
};

export const mapBarnToApiData = (
    { harAleneomsorg, harAleneomsorgFor, harUtvidetRett, harUtvidetRettFor, andreBarn }: SoknadFormData,
    registrerteBarn: Barn[]
): BarnApiData => {
    const barn: ApiBarn[] = [
        ...andreBarn.map((barn) => mapAnnetBarnToApiBarn(barn, harAleneomsorgFor, harUtvidetRettFor)),
        ...registrerteBarn.map((barn) => mapBarnToApiBarn(barn, harAleneomsorgFor, harUtvidetRettFor)),
    ];
    return {
        harAleneomsorg: harAleneomsorg === YesOrNo.YES,
        harUtvidetRett: harUtvidetRett === YesOrNo.YES,
        barn: barn.sort(sortBarnByFødseldsdato),
    };
};
