import { SoknadApiData, SoknadApiDataFieldCommon } from '../../types/SoknadApiData';
import { MottakerFormData } from '../../types/SoknadFormData';

export type MottakerApiData = Pick<
    SoknadApiData,
    SoknadApiDataFieldCommon.mottakerFnr | SoknadApiDataFieldCommon.mottakerNavn
>;

export const mapMottakerToApiData = ({ fnrMottaker, navnMottaker }: MottakerFormData): MottakerApiData => {
    return {
        mottakerFnr: fnrMottaker,
        mottakerNavn: navnMottaker,
    };
};
