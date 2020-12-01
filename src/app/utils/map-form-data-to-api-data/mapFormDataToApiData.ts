import { getLocaleForApi } from '@navikt/sif-common-core/lib/utils/localeUtils';
import {
    SoknadApiData,
    SoknadApiDataBase,
    SøknadFordeling,
    SøknadKoronaoverføring,
    SøknadOverføring,
} from '../../types/SoknadApiData';
import { Barn, SoknadFormData } from '../../types/SoknadFormData';
import { getSoknadstype, Soknadstype } from '../../types/Soknadstype';
import { mapBarnStepToApiData } from './mapBarnStepToApiData';
import { mapDinSituasjonToApiData } from './mapDinSituasjonToApiData';
import { mapMottakerToApiData } from './mapMottakerToApiData';

interface MapFormDataToApiDataValues {
    soknadId: string;
    locale: string;
    formData: SoknadFormData;
    registrerteBarn: Barn[];
}

const getCommonApiData = ({
    soknadId,
    locale = 'nb',
    formData,
    registrerteBarn,
}: MapFormDataToApiDataValues): SoknadApiDataBase => ({
    id: soknadId,
    språk: getLocaleForApi(locale),
    harBekreftetOpplysninger: formData.harBekreftetOpplysninger,
    harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
    ...mapDinSituasjonToApiData(formData),
    ...mapMottakerToApiData(formData),
    ...mapBarnStepToApiData(formData, registrerteBarn),
});

export const getSøknadKoronaoverføring = (values: MapFormDataToApiDataValues): SøknadKoronaoverføring | undefined => {
    const { antallDagerSomSkalOverføres } = values.formData;
    if (antallDagerSomSkalOverføres === undefined) {
        return undefined;
    }
    return {
        ...getCommonApiData(values),
        korona: {
            antallDagerSomSkalOverføres,
        },
    };
};

export const getSøknadFordeling = (values: MapFormDataToApiDataValues): SøknadFordeling | undefined => {
    const { mottakerType, samværsavtale } = values.formData;
    if (mottakerType === undefined) {
        return undefined;
    }
    return {
        ...getCommonApiData(values),
        fordeling: {
            mottakerType: mottakerType,
            samværsavtale: samværsavtale,
        },
    };
};

export const getSøknadOverføring = (values: MapFormDataToApiDataValues): SøknadOverføring | undefined => {
    const { antallDagerSomSkalOverføres, mottakerType } = values.formData;
    if (antallDagerSomSkalOverføres === undefined || mottakerType === undefined) {
        return undefined;
    }
    return {
        ...getCommonApiData(values),
        overføring: {
            antallDagerSomSkalOverføres,
            mottakerType: mottakerType,
        },
    };
};

export const mapFormDataToApiData = (values: MapFormDataToApiDataValues): SoknadApiData | undefined => {
    const søknadstype = getSoknadstype(values.formData);
    if (søknadstype === undefined) {
        return undefined;
    }
    try {
        switch (søknadstype) {
            case Soknadstype.korona:
                return getSøknadKoronaoverføring(values);
            case Soknadstype.fordeling:
                return getSøknadFordeling(values);
            case Soknadstype.overføring:
                return getSøknadOverføring(values);
        }
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};
