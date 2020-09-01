import { MessageFileFormat } from '@sif-common-core/dev-utils/intl/devIntlUtils';
import { allCommonMessages } from '@sif-common-core/i18n/allCommonMessages';

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
