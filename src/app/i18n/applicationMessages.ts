import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';

const appMessagesNB = require('./nb.json');
const introFormMessagesNB = require('../pages/intro-page/introFormMessagesNB.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appMessagesNB,
    ...introFormMessagesNB,
};
const nynorsktekster = {
    ...allCommonMessages.nn,
};

export const applicationIntlMessages: MessageFileFormat = {
    nb: bokmålstekster,
    nn: nynorsktekster,
};
