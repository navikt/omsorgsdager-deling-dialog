import {
    ApiBarn,
    isSøknadFordeling,
    isSøknadKoronaoverføring,
    isSøknadOverføring,
    SoknadApiData,
    SoknadApiDataFelles,
    SoknadApiDataFieldCommon,
    SoknadApiDataFieldFordeling,
    SoknadApiDataFieldKorona,
    SoknadApiDataFieldOverføring,
    SøknadFordelingApiData,
    SøknadKoronaoverføringApiData,
    SøknadOverføringApiData,
} from '../types/SoknadApiData';
import { Søknadstype } from '../types/Soknadstype';

const harAleneomsorgForBarn = (apiData: SoknadApiData) =>
    apiData.barn.filter((b: ApiBarn) => b.aleneOmOmsorgen === true && (b.aktørId || b.identitetsnummer)).length > 0;

type ApiDataVerification<ApiData> = (values: ApiData) => boolean;

interface SoknadApiVerification<ApiData> {
    [key: string]: ApiDataVerification<ApiData>;
}

export const SoknadApiFellesVerification: SoknadApiVerification<
    SoknadApiDataFelles | SøknadFordelingApiData | SøknadOverføringApiData | SøknadKoronaoverføringApiData
> = {
    [SoknadApiDataFieldCommon.id]: ({ id }) => id !== undefined,
    [SoknadApiDataFieldCommon.type]: ({ type }) => type !== undefined,
    [SoknadApiDataFieldCommon.harForståttRettigheterOgPlikter]: ({ harForståttRettigheterOgPlikter }) =>
        harForståttRettigheterOgPlikter === true,
    [SoknadApiDataFieldCommon.mottakerFnr]: ({ mottakerFnr }) => mottakerFnr !== undefined,
    [SoknadApiDataFieldCommon.mottakerNavn]: ({ mottakerNavn }) => mottakerNavn !== undefined,
    [SoknadApiDataFieldCommon.harAleneomsorg]: ({ harAleneomsorg }) => harAleneomsorg !== undefined,
    [SoknadApiDataFieldCommon.harUtvidetRett]: ({ harUtvidetRett }) => harUtvidetRett !== undefined,
    [SoknadApiDataFieldCommon.erYrkesaktiv]: ({ erYrkesaktiv }) => erYrkesaktiv !== undefined,
    [SoknadApiDataFieldCommon.arbeiderINorge]: ({ arbeiderINorge }) => arbeiderINorge !== undefined,
    [SoknadApiDataFieldCommon.arbeidssituasjon]: ({ arbeidssituasjon }) => arbeidssituasjon !== undefined,
    [SoknadApiDataFieldCommon.antallDagerBruktEtter1Juli]: ({ antallDagerBruktEtter1Juli }) =>
        antallDagerBruktEtter1Juli === undefined || antallDagerBruktEtter1Juli >= 0,
    [SoknadApiDataFieldCommon.barn]: ({ barn }) => barn !== undefined && barn.length > 0,
    [SoknadApiDataFieldKorona.korona]: (apiValues) => {
        if (isSøknadKoronaoverføring(apiValues)) {
            const { korona } = apiValues;
            return korona !== undefined && korona.antallDagerSomSkalOverføres > 0;
        }
        return true;
    },
    [SoknadApiDataFieldFordeling.fordeling]: (apiValues) => {
        if (isSøknadFordeling(apiValues)) {
            const { fordeling } = apiValues;
            return fordeling !== undefined && harAleneomsorgForBarn(apiValues) && fordeling.mottakerType !== undefined;
        }
        return true;
    },
    [SoknadApiDataFieldOverføring.overføring]: (apiValues) => {
        if (isSøknadOverføring(apiValues)) {
            const { overføring } = apiValues;
            return (
                overføring !== undefined &&
                harAleneomsorgForBarn(apiValues) &&
                overføring.antallDagerSomSkalOverføres !== undefined &&
                overføring.antallDagerSomSkalOverføres >= 0 &&
                overføring.mottakerType !== undefined
            );

            return overføring !== undefined && overføring.mottakerType !== undefined;
        }
        return true;
    },
};

const runVerification = (keys: string[], values: SoknadApiDataFelles): SoknadApiDataFieldCommon[] => {
    const errors: SoknadApiDataFieldCommon[] = [];
    keys.forEach((key: SoknadApiDataFieldCommon) => {
        const func = SoknadApiFellesVerification[key];
        if (func && func(values) === false) {
            errors.push(key);
        }
    });
    return errors;
};

export const verifySoknadApiData = (apiData?: SoknadApiData): boolean => {
    if (!apiData || !apiData.type) {
        return false;
    }
    if (runVerification(Object.keys(SoknadApiDataFieldCommon), apiData).length > 0) {
        return false;
    }
    switch (apiData.type) {
        case Søknadstype.koronaoverføring:
            return runVerification(Object.keys(SoknadApiDataFieldKorona), apiData).length === 0;
        case Søknadstype.overføring:
            return runVerification(Object.keys(SoknadApiDataFieldOverføring), apiData).length === 0;
        case Søknadstype.fordeling:
            return runVerification(Object.keys(SoknadApiDataFieldFordeling), apiData).length === 0;
    }
};
