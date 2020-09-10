import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData, Barn } from '../../types/SoknadFormData';
import { mapDinSituasjonToApiData } from './mapDinSituasjonToApiData';
import { mapMottakerToApiData } from './mapMottakerToApiData';
import { mapDineBarnToApiData } from './mapDineBarnToApiData';
import { mapOmBarnaToApiData } from './mapOmBarnaToApiData';

export const mapFormDataToApiData = (
    locale = 'nb',
    formData: SoknadFormData,
    barn: Barn[]
): SoknadApiData | undefined => {
    try {
        const apiData: SoknadApiData = {
            språk: locale === 'en' ? 'nn' : 'nb',
            harBekreftetOpplysninger: formData.harBekreftetOpplysninger,
            harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
            ...mapDinSituasjonToApiData(formData),
            ...mapMottakerToApiData(formData),
            ...mapDineBarnToApiData(formData),
            ...mapOmBarnaToApiData(formData, barn),
        };
        return apiData;
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};
