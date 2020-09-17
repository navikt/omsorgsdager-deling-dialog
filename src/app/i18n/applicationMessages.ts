import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import annetBarnMessages from '@navikt/sif-common-forms/lib/annet-barn/annetBarnMessages';

const appMessagesNB = require('./nb.json');
const newCommonMessagesNB = require('../../common/i18n/nb.json');
const introFormMessagesNB = require('../pages/intro-page/introFormMessagesNB.json');
const dinePlikterNB = require('../soknad/velkommen-page/dine-plikter/dinePlikterNB.json');
const personopplysningerNB = require('../soknad/velkommen-page/personopplysninger/personopplysningerNB.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appMessagesNB,
    ...introFormMessagesNB,
    ...dinePlikterNB,
    ...personopplysningerNB,
    ...annetBarnMessages.nb,
    ...newCommonMessagesNB,
};
const nynorsktekster = {
    ...allCommonMessages.nn,
    ...annetBarnMessages.nn,
};

export const applicationIntlMessages: MessageFileFormat = {
    nb: bokmålstekster,
    nn: nynorsktekster,
};
