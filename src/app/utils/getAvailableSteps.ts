import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { StepID } from '../soknad/StepID';
import { Barn, SoknadFormData } from '../types/SoknadFormData';
import { DineBarnFormData } from './map-form-data-to-api-data/mapDineBarnToApiData';
import { OmBarnaFormData } from './map-form-data-to-api-data/mapOmBarnaToApiData';
import { DinSituasjonFormData } from './map-form-data-to-api-data/mapDinSituasjonToApiData';
import { MottakerFormData } from './map-form-data-to-api-data/mapMottakerToApiData';
import { ANTALL_DAGER_RANGE } from '../soknad/mottaker-step/MottakerStep';
import { validateFødselsnummer } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { validateFødselsnummerIsDifferentThan } from '../validation/fieldValidation';
import { Person } from '../types/Person';

const dineBarnIsComplete = ({ andreBarn }: Partial<DineBarnFormData>, barn: Barn[]): boolean => {
    return barn.length > 0 || (andreBarn || []).length > 0;
};

const omBarnaIsComplete = ({
    harAleneomsorg,
    harUtvidetRett,
    harAleneomsorgFor,
    harUtvidetRettFor,
}: Partial<OmBarnaFormData>): boolean => {
    if (harAleneomsorg !== YesOrNo.YES) {
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
    arbeiderINorge,
    borINorge,
    arbeidssituasjon,
    harBruktOmsorgsdagerEtter1Juli,
    antallDagerBruktEtter1Juli,
}: Partial<DinSituasjonFormData>): boolean => {
    if (arbeiderINorge !== YesOrNo.YES) {
        return false;
    }
    if (borINorge === YesOrNo.UNANSWERED) {
        return false;
    }
    if (arbeidssituasjon?.length === 0) {
        return false;
    }
    if (harBruktOmsorgsdagerEtter1Juli === YesOrNo.UNANSWERED) {
        return false;
    }
    if (harBruktOmsorgsdagerEtter1Juli === YesOrNo.YES) {
        if (antallDagerBruktEtter1Juli === undefined) {
            return false;
        }
        if (antallDagerBruktEtter1Juli < ANTALL_DAGER_RANGE.min) {
            return false;
        }
        if (antallDagerBruktEtter1Juli > ANTALL_DAGER_RANGE.max) {
            return false;
        }
    }
    return true;
};

const mottakerIsComplete = (
    {
        overføreTilEktefelle,
        overføreTilSamboer,
        fnrMottaker,
        navnMottaker,
        antallDagerSomSkalOverføres,
    }: Partial<MottakerFormData>,
    søker: Person
): boolean => {
    if (overføreTilEktefelle === YesOrNo.NO && overføreTilSamboer !== YesOrNo.YES) {
        return false;
    }
    if (overføreTilSamboer === YesOrNo.NO && overføreTilEktefelle !== YesOrNo.YES) {
        return false;
    }
    if (
        validateFødselsnummer(fnrMottaker || '') !== undefined ||
        validateFødselsnummerIsDifferentThan(søker.fødselsnummer) !== undefined
    ) {
        return false;
    }
    if ((navnMottaker || '')?.length < 1) {
        return false;
    }

    if (
        antallDagerSomSkalOverføres === undefined ||
        antallDagerSomSkalOverføres < ANTALL_DAGER_RANGE.min ||
        antallDagerSomSkalOverføres > ANTALL_DAGER_RANGE.max
    ) {
        return false;
    }
    return true;
};

export const getAvailableSteps = (values: Partial<SoknadFormData>, søker: Person, barn: Barn[]): StepID[] => {
    const steps: StepID[] = [];
    steps.push(StepID.DINE_BARN);
    if (dineBarnIsComplete(values, barn)) {
        steps.push(StepID.OM_BARNA);
    }
    if (omBarnaIsComplete(values)) {
        steps.push(StepID.DIN_SITUASJON);
    }
    if (dinSituasjonIsComplete(values)) {
        steps.push(StepID.MOTTAKER);
    }
    if (mottakerIsComplete(values, søker)) {
        steps.push(StepID.OPPSUMMERING);
    }
    return steps;
};

export const isStepAvailable = (stepId: StepID, availableSteps: StepID[]): boolean => {
    return availableSteps.find((id) => id === stepId) !== undefined;
};
