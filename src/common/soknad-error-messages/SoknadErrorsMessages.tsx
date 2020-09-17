import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Ingress } from 'nav-frontend-typografi';
import ErrorGuide from '../error-guide/ErrorGuide';

const GeneralApplicationError = () => (
    <ErrorGuide title="Noe gikk galt...">
        <p>Beklager, her har det dessverre skjedd en feil. Dersom feilen fortsetter, prøv igjen litt senere.</p>
    </ErrorGuide>
);

interface FrontpageUrlProps {
    frontpageUrl?: string;
}

const GeneralSoknadError = ({ frontpageUrl }: FrontpageUrlProps) => (
    <ErrorGuide title="Noe gikk galt...">
        <p>
            Beklager, her har det dessverre skjedd en feil. Vennligst gå tilbake og prøv igjen. Dersom feilen
            fortsetter, prøv igjen litt senere.
        </p>
        {frontpageUrl && <Lenke href={frontpageUrl}>Gå tilbake til startsiden for søknaden</Lenke>}
    </ErrorGuide>
);

const MissingSoknadData = ({ frontpageUrl }: FrontpageUrlProps) => (
    <ErrorGuide title="Det oppstod en feil under visning av siden">
        <p>
            Noe gikk feil under visning av denne siden. Du må dessverre fylle ut søknaden på nytt. Vi beklager ulempen
            det medfører for deg.
        </p>
        {frontpageUrl && <Lenke href={frontpageUrl}>Gå tilbake til startsiden for søknaden</Lenke>}
    </ErrorGuide>
);

const MissingApiDataError = ({ frontpageUrl }: FrontpageUrlProps) => (
    <ErrorGuide title="Det oppstod en feil under visning av siden">
        <p>
            Noe gikk feil under visning av denne siden. Du må dessverre fylle ut søknaden på nytt. Vi beklager ulempen
            det medfører for deg. Dersom feilen fortsetter, prøv igjen litt senere.
        </p>
        {frontpageUrl && <Lenke href={frontpageUrl}>Gå tilbake til startsiden for søknaden</Lenke>}
    </ErrorGuide>
);

const ApplicationUnavailable = () => (
    <ErrorGuide title="Søknaden er dessverre ikke tilgjengelig">
        <p>Vi jobber så raskt vi kan med å få den tilgjengelig.</p>
    </ErrorGuide>
);

const UnknownRoute = () => (
    <ErrorGuide title="Du har kommet til en side som ikke finnes">
        <Ingress>Vennligst gå tilbake</Ingress>
    </ErrorGuide>
);

const SoknadErrorMessages = {
    ApplicationUnavailable,
    GeneralApplicationError,
    UnknownRoute,
    GeneralSoknadError,
    MissingSoknadData,
    MissingApiDataError,
};
export default SoknadErrorMessages;
