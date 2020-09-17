import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';

const soknadErrorIntlMessages: MessageFileFormat = {
    nb: {
        'common.soknadErrorMessages.defaultTitle': 'Noe gikk galt...',
        'common.soknadErrorMessages.generalError.content':
            'Beklager, her har det dessverre skjedd en feil. Dersom feilen fortsetter, prøv igjen litt senere.',
        'common.soknadErrorMessages.generalSoknadError.content':
            'Beklager, her har det dessverre skjedd en feil. Vennligst gå tilbake og prøv igjen. Dersom feilen fortsetter, prøv igjen litt senere.',
        'common.soknadErrorMessages.gotoSoknadFrontpage': 'Gå tilbake til startsiden for søknaden',

        'common.soknadErrorMessages.missingSoknadData.title': 'Det oppstod en feil under visning av siden',
        'common.soknadErrorMessages.missingSoknadData.content':
            'Noe gikk feil under visning av denne siden. Du må dessverre fylle ut søknaden på nytt. Vi beklager ulempen det medfører for deg.',

        'common.soknadErrorMessages.missingApiData.title': 'Det oppstod en feil under visning av siden',
        'common.soknadErrorMessages.missingApiData.content':
            'Noe gikk feil under visning av denne siden. Du må dessverre fylle ut søknaden på nytt. Vi beklager ulempen det medfører for deg. Dersom feilen fortsetter, prøv igjen litt senere.',

        'common.soknadErrorMessages.applicationUnavailable.title': 'Søknaden er dessverre ikke tilgjengelig',
        'common.soknadErrorMessages.applicationUnavailable.content':
            'Vi jobber så raskt vi kan med å få den tilgjengelig.',

        'common.soknadErrorMessages.unknownRoute.title': 'Du har kommet til en side som ikke finnes',
        'common.soknadErrorMessages.unknownRoute.content': 'Vennligst gå tilbake',
    },
};

export default soknadErrorIntlMessages;
