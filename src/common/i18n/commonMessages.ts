import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import soknadErrorIntlMessages from '../soknad-error-messages/soknadErrorIntlMessages';

const commonMessages: MessageFileFormat = {
    nb: { ...require('./nb.json'), ...soknadErrorIntlMessages.nb },
};

export default commonMessages;
