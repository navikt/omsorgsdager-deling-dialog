import dayjs from 'dayjs';
import { Feature, isFeatureEnabled } from './featureToggleUtils';

export const dateBefore = '2021-01-01';
export const dateAfter = '2020-12-31 23:59:59';

export const isDateBefore2021 = () => {
    if (isFeatureEnabled(Feature.KORONA_2021_PERIODE_ENABLED)) {
        return false;
    } else {
        return dayjs().isBefore(dayjs(dateBefore));
    }
};

export const isDateAfter2020 = () => {
    if (isFeatureEnabled(Feature.KORONA_2021_PERIODE_ENABLED)) {
        return true;
    } else {
        return dayjs().isAfter(dayjs(dateAfter));
    }
};
