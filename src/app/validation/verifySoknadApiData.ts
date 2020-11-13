import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { ApiBarn, SoknadApiData } from '../types/SoknadApiData';

export const verifySoknadApiData = (data?: SoknadApiData | any): boolean => {
    if (!data) {
        return false;
    }
    const harAleneomsorgForBarn =
        data.barn.filter((b: ApiBarn) => b.aleneOmOmsorgen === true && (b.aktørId || b.identitetsnummer)).length > 0;

    return (
        data.id !== undefined &&
        data.harBekreftetOpplysninger &&
        data.harForståttRettigheterOgPlikter &&
        data.arbeiderINorge &&
        data.harAleneomsorg &&
        data.arbeidssituasjon.length > 0 &&
        harAleneomsorgForBarn &&
        data.antallDagerSomSkalOverføres > 0 &&
        hasValue(data.mottakerFnr) &&
        hasValue(data.mottakerNavn) &&
        hasValue(data.mottakerType)
    );
};
