import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData, Barn } from '../../types/SoknadFormData';
import { mapBarnToApiData } from './mapBarnToApiData';
import { mapDinSituasjonToApiData } from './mapDinSituasjonToApiData';
import { mapMottakerToApiData } from './mapMottakerToApiData';

export const mapFormDataToApiData = (
    soknadId: string,
    locale = 'nb',
    formData: SoknadFormData,
    registrerteBarn: Barn[]
): SoknadApiData | undefined => {
    try {
        const apiData: SoknadApiData = {
            id: soknadId,
            språk: locale === 'en' ? 'nn' : 'nb',
            harBekreftetOpplysninger: formData.harBekreftetOpplysninger,
            harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
            ...mapDinSituasjonToApiData(formData),
            ...mapMottakerToApiData(formData),
            ...mapBarnToApiData(formData, registrerteBarn),
        };
        return apiData;
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};
