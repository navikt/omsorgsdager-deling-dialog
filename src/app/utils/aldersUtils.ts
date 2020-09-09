import moment from 'moment';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';

export const aldersBegrensingOver = (fødselsdato: Date, maxGrenseYears: number): boolean => {
    return moment().diff(fødselsdato, 'years') <= maxGrenseYears;
};

export const nYearsAgo = (years: number) => {
    return moment(dateToday).subtract(years, 'y').startOf('year').toDate();
};
