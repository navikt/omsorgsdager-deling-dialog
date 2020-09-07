import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';
import { mapDinSituasjonToApiData } from './mapDinSituasjonToApiData';
import { mapMottakerToApiData } from './mapMottakerToApiData';

export const mapFormDataToApiData = (formData: SoknadFormData): Partial<SoknadApiData> => {
    const apiData: Partial<SoknadApiData> = {
        ...mapDinSituasjonToApiData(formData),
        ...mapMottakerToApiData(formData),
    };
    return apiData;
};
