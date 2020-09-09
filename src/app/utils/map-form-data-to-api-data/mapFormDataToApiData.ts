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
        const apiData: Partial<SoknadApiData> = {
            språk: locale === 'en' ? 'nn' : 'nb',
            harBekreftetOpplysninger: formData.harBekreftetMottakerOpplysninger,
            harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
            ...mapDinSituasjonToApiData(formData),
            ...mapMottakerToApiData(formData),
            ...mapDineBarnToApiData(formData),
            ...mapOmBarnaToApiData(formData, barn),
        };
        return apiData as SoknadApiData; // Hack frem til vi har mappet all data
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};
