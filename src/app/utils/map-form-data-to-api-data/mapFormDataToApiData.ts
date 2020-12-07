import { getLocaleForApi } from '@navikt/sif-common-core/lib/utils/localeUtils';
import {
    SoknadApiData,
    SoknadApiDataFelles,
    StengingsperiodeAPI,
    SøknadFordelingApiData,
    SøknadKoronaoverføringApiData,
    SøknadOverføringApiData,
} from '../../types/SoknadApiData';
import { Barn, SoknadFormData, Stengingsperiode } from '../../types/SoknadFormData';
import { getSøknadstype, Søknadstype } from '../../types/Soknadstype';
import { mapBarnStepToApiData } from './mapBarnStepToApiData';
import { mapDinSituasjonToApiData } from './mapDinSituasjonToApiData';
import { mapMottakerToApiData } from './mapMottakerToApiData';

interface MapFormDataToApiDataValues {
    soknadId: string;
    locale: string;
    formData: SoknadFormData;
    registrerteBarn: Barn[];
}

export const getStegningsPeriode = (stengingsperiode: Stengingsperiode): StengingsperiodeAPI => {
    if (stengingsperiode === Stengingsperiode.fra13marsTil30Juni2020) {
        return { fom: '2020-03-13', tom: '2020-06-30' };
    } else {
        return { fom: '2020-08-10', tom: 'ikke satt' };
    }
};

const getCommonApiData = ({
    soknadId,
    locale = 'nb',
    formData,
    registrerteBarn,
}: MapFormDataToApiDataValues): Omit<SoknadApiDataFelles, 'type'> => ({
    id: soknadId,
    språk: getLocaleForApi(locale),
    harBekreftetOpplysninger: formData.harBekreftetOpplysninger,
    harForståttRettigheterOgPlikter: formData.harForståttRettigheterOgPlikter,
    ...mapDinSituasjonToApiData(formData),
    ...mapMottakerToApiData(formData),
    ...mapBarnStepToApiData(formData, registrerteBarn),
});

export const getSøknadKoronaoverføring = (
    values: MapFormDataToApiDataValues
): SøknadKoronaoverføringApiData | undefined => {
    const { antallDagerSomSkalOverføres, stengingsperiode } = values.formData;
    if (antallDagerSomSkalOverføres === undefined) {
        return undefined;
    }
    if (stengingsperiode === undefined) {
        return undefined;
    }
    return {
        ...getCommonApiData(values),
        type: Søknadstype.koronaoverføring,
        korona: {
            antallDagerSomSkalOverføres,
            stengingsperiode: getStegningsPeriode(stengingsperiode),
        },
    };
};

export const getSøknadFordeling = (values: MapFormDataToApiDataValues): SøknadFordelingApiData | undefined => {
    const { mottakerType, samværsavtale } = values.formData;
    if (mottakerType === undefined) {
        return undefined;
    }
    const samværsavtaleVedleggUrl: string[] = [];
    samværsavtale.forEach((s) => {
        if (s.url) {
            samværsavtaleVedleggUrl.push(s.url);
        }
    });
    return {
        ...getCommonApiData(values),
        type: Søknadstype.fordeling,
        fordeling: {
            mottakerType: mottakerType,
            samværsavtale: samværsavtaleVedleggUrl,
        },
    };
};

export const getSøknadOverføring = (values: MapFormDataToApiDataValues): SøknadOverføringApiData | undefined => {
    const { antallDagerSomSkalOverføres, mottakerType } = values.formData;
    if (antallDagerSomSkalOverføres === undefined || mottakerType === undefined) {
        return undefined;
    }
    return {
        ...getCommonApiData(values),
        type: Søknadstype.overføring,
        overføring: {
            antallDagerSomSkalOverføres,
            mottakerType: mottakerType,
        },
    };
};

export const mapFormDataToApiData = (values: MapFormDataToApiDataValues): SoknadApiData | undefined => {
    const søknadstype = getSøknadstype(values.formData);
    if (søknadstype === undefined) {
        return undefined;
    }
    try {
        switch (søknadstype) {
            case Søknadstype.koronaoverføring:
                return getSøknadKoronaoverføring(values);
            case Søknadstype.fordeling:
                return getSøknadFordeling(values);
            case Søknadstype.overføring:
                return getSøknadOverføring(values);
        }
    } catch (error) {
        console.error('mapFormDataToApiData failed', error);
        return undefined;
    }
};
