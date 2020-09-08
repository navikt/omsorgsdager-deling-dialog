import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData } from '../../types/SoknadFormData';
import { mapDinSituasjonToApiData } from './mapDinSituasjonToApiData';
import { mapMottakerToApiData } from './mapMottakerToApiData';

export const mapFormDataToApiData = (locale = 'nb', formData: SoknadFormData): SoknadApiData | undefined => {
    try {
        const apiData: Partial<SoknadApiData> = {
            språk: locale === 'en' ? 'nn' : 'nb',
            harBekreftetOpplysninger: formData.harBekreftetMottakerOpplysninger,
            harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
            ...mapDinSituasjonToApiData(formData),
            ...mapMottakerToApiData(formData),
        };
        return apiData as SoknadApiData; // Hack frem til vi har mappet all data
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};
