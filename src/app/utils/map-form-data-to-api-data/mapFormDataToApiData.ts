import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';
import { mapDinSituasjonToApiData } from './mapDinSituasjonToApiData';
import { mapMottakerToApiData } from './mapMottakerToApiData';

export const mapFormDataToApiData = (formData: SoknadFormData): Partial<SoknadApiData> | undefined => {
    try {
        const apiData: Partial<SoknadApiData> = {
            ...mapDinSituasjonToApiData(formData),
            ...mapMottakerToApiData(formData),
        };
        return apiData;
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};
