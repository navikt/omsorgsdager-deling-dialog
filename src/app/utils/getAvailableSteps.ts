import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { validateFødselsnummer } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { ANTALL_DAGER_RANGE } from '../soknad/mottaker-step/MottakerStep';
import { StepID } from '../soknad/soknadStepsConfig';
import { Person } from '../types/Person';
import {
    Barn,
    DineBarnFormData,
    DinSituasjonFormData,
    Mottaker,
    MottakerFormData,
    OmBarnaFormData,
    SoknadFormData,
    Stengingsperiode,
} from '../types/SoknadFormData';
import { validateFødselsnummerIsDifferentThan } from '../validation/fieldValidation';

const dineBarnIsComplete = ({ andreBarn }: Partial<DineBarnFormData>, barn: Barn[]): boolean => {
    return barn.length > 0 || (andreBarn || []).length > 0;
};

const omBarnaIsComplete = (
    gjelderKoronaverføring: boolean,
    { harAleneomsorg, harUtvidetRett, harAleneomsorgFor, harUtvidetRettFor }: Partial<OmBarnaFormData>
): boolean => {
    if (
        (gjelderKoronaverføring && harAleneomsorg === YesOrNo.UNANSWERED) ||
        (gjelderKoronaverføring === false && harAleneomsorg !== YesOrNo.YES)
    ) {
        return false;
    }
    if (harAleneomsorg === YesOrNo.YES && harAleneomsorgFor?.length === 0) {
        return false;
    }
    if (harUtvidetRett === YesOrNo.UNANSWERED) {
        return false;
    }
    if (harUtvidetRett === YesOrNo.YES && harUtvidetRettFor?.length === 0) {
        return false;
    }
    return true;
};

const dinSituasjonIsComplete = ({
    erYrkesaktiv,
    arbeiderINorge,
    arbeidssituasjon,
    harBruktOmsorgsdagerEtter1Juli,
    antallDagerBruktEtter1Juli,
}: Partial<DinSituasjonFormData>): boolean => {
    if (erYrkesaktiv !== YesOrNo.YES) {
        return false;
    }

    if (arbeiderINorge === YesOrNo.UNANSWERED) {
        return false;
    }
    if (arbeidssituasjon?.length === 0) {
        return false;
    }
    if (harBruktOmsorgsdagerEtter1Juli === YesOrNo.UNANSWERED) {
        return false;
    }
    if (harBruktOmsorgsdagerEtter1Juli === YesOrNo.YES && antallDagerBruktEtter1Juli === undefined) {
        return false;
    }
    return true;
};

const mottakerIsComplete = (
    {
        fnrMottaker,
        navnMottaker = '',
        antallDagerSomSkalOverføres,
        gjelderMidlertidigPgaKorona,
        mottakerType,
        stengingsperiode,
    }: Partial<MottakerFormData>,
    søker: Person
): boolean => {
    const fnrValid = validateFødselsnummer(fnrMottaker || '');
    const fnrDifferent = validateFødselsnummerIsDifferentThan(søker.fødselsnummer)(fnrMottaker || '');
    const gjelderKoronaverføring = gjelderMidlertidigPgaKorona === YesOrNo.YES;
    const riktigStengingsperiode =
        stengingsperiode === Stengingsperiode.fra13marsTil30Juni2020 ||
        stengingsperiode === Stengingsperiode.fraOgMed10August2020til31Desember2020 ||
        stengingsperiode === Stengingsperiode.fraOgMed1januar2021til31Desember2021;
    if (fnrValid !== undefined || fnrDifferent !== undefined) {
        return false;
    }
    if ((navnMottaker || '')?.length < 1) {
        return false;
    }
    if (
        mottakerType !== Mottaker.samværsforelder &&
        (antallDagerSomSkalOverføres === undefined ||
            antallDagerSomSkalOverføres < ANTALL_DAGER_RANGE.min ||
            (gjelderKoronaverføring === false && antallDagerSomSkalOverføres > ANTALL_DAGER_RANGE.max))
    ) {
        return false;
    }
    if (gjelderKoronaverføring === false && stengingsperiode !== undefined) {
        return false;
    }
    if (gjelderKoronaverføring === true && !riktigStengingsperiode) {
        return false;
    }
    return true;
};

export const getAvailableSteps = (values: Partial<SoknadFormData>, søker: Person, barn: Barn[]): StepID[] => {
    const steps: StepID[] = [];
    steps.push(StepID.MOTTAKER);
    const gjelderKoronaverføring = values.gjelderMidlertidigPgaKorona === YesOrNo.YES;
    if (mottakerIsComplete(values, søker)) {
        steps.push(StepID.DINE_BARN);
    }
    if (dineBarnIsComplete(values, barn)) {
        steps.push(StepID.OM_BARNA);
    }
    if (omBarnaIsComplete(gjelderKoronaverføring, values)) {
        steps.push(StepID.DIN_SITUASJON);
    }
    if (
        dinSituasjonIsComplete(values) &&
        gjelderKoronaverføring === false &&
        values.mottakerType === Mottaker.samværsforelder
    ) {
        steps.push(StepID.SAMVÆRSAVTALE);
    }

    if (dinSituasjonIsComplete(values)) {
        steps.push(StepID.OPPSUMMERING);
    }
    return steps;
};

export const isStepAvailable = (stepId: StepID, availableSteps: StepID[]): boolean => {
    return availableSteps.find((id) => id === stepId) !== undefined;
};
