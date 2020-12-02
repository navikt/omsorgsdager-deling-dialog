import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import {
    ApiBarn,
    SoknadApiData,
    SøknadFordelingApiData,
    SøknadKoronaoverføringApiData,
    SøknadOverføringApiData,
    SoknadApiDataFelles,
} from '../types/SoknadApiData';
import { Søknadstype } from '../types/Soknadstype';

const harAleneomsorgForBarn = (apiData: SoknadApiData) =>
    apiData.barn.filter((b: ApiBarn) => b.aleneOmOmsorgen === true && (b.aktørId || b.identitetsnummer)).length > 0;

const verifySøknadBase = (apiData: SoknadApiDataFelles): boolean => {
    return (
        apiData.id !== undefined &&
        apiData.harForståttRettigheterOgPlikter &&
        apiData.erYrkesaktiv &&
        apiData.arbeidssituasjon.length > 0 &&
        hasValue(apiData.mottakerFnr) &&
        hasValue(apiData.mottakerNavn)
    );
};

const verifySøknadKoronaoverføring = ({
    korona: { antallDagerSomSkalOverføres },
}: SøknadKoronaoverføringApiData): boolean => {
    return antallDagerSomSkalOverføres !== undefined && antallDagerSomSkalOverføres >= 0;
};

const verifySøknadFordeling = ({ harAleneomsorg, fordeling: { mottakerType } }: SøknadFordelingApiData): boolean => {
    return harAleneomsorg && mottakerType !== undefined;
};

const verifySøknadOverføring = ({
    harAleneomsorg,
    overføring: { antallDagerSomSkalOverføres, mottakerType },
}: SøknadOverføringApiData): boolean => {
    return (
        harAleneomsorg &&
        antallDagerSomSkalOverføres !== undefined &&
        antallDagerSomSkalOverføres >= 0 &&
        mottakerType !== undefined
    );
};

export const verifySoknadApiData = (apiData?: SoknadApiData): boolean => {
    if (!apiData || !apiData.type) {
        return false;
    }
    if (verifySøknadBase(apiData) === false) {
        return false;
    }

    switch (apiData.type) {
        case Søknadstype.koronaoverføring:
            return verifySøknadKoronaoverføring(apiData);
        case Søknadstype.overføring:
            return harAleneomsorgForBarn(apiData) && verifySøknadOverføring(apiData);
        case Søknadstype.fordeling:
            return harAleneomsorgForBarn(apiData) && verifySøknadFordeling(apiData);
    }
};
