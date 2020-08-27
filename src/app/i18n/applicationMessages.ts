import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';

const bokmålstekster = {
    ...allCommonMessages.nb,
};
const nynorsktekster = {
    ...allCommonMessages.nn,
};

export const applicationIntlMessages: MessageFileFormat = {
    nb: bokmålstekster,
    nn: nynorsktekster,
};
