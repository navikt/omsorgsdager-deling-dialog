import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Ingress } from 'nav-frontend-typografi';
import ErrorGuide from '../error-guide/ErrorGuide';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface ErrorWithFrontpageUrlProps {
    soknadFrontpageUrl?: string;
}

const SoknadErrorMessage = ({
    titleKey,
    contentKey,
    soknadFrontpageUrl,
}: {
    titleKey: string;
    contentKey: string;
    soknadFrontpageUrl?: string;
}) => {
    const intl = useIntl();
    return (
        <ErrorGuide title={intlHelper(intl, titleKey)}>
            <Ingress tag="div">
                <p>
                    <FormattedMessage id={contentKey} />
                </p>
                {soknadFrontpageUrl && (
                    <Lenke href={soknadFrontpageUrl}>
                        <FormattedMessage id="common.soknadErrorMessages.gotoSoknadFrontpage" />
                    </Lenke>
                )}
            </Ingress>
        </ErrorGuide>
    );
};

const GeneralApplicationError = () => (
    <SoknadErrorMessage
        titleKey="common.soknadErrorMessages.defaultTitle"
        contentKey="common.soknadErrorMessages.generalError.content"
    />
);

const GeneralSoknadError = ({ soknadFrontpageUrl }: ErrorWithFrontpageUrlProps) => (
    <SoknadErrorMessage
        titleKey="common.soknadErrorMessages.defaultTitle"
        contentKey="common.soknadErrorMessages.generalSoknadError.content"
        soknadFrontpageUrl={soknadFrontpageUrl}
    />
);

const MissingSoknadDataError = ({ soknadFrontpageUrl }: ErrorWithFrontpageUrlProps) => (
    <SoknadErrorMessage
        titleKey="common.soknadErrorMessages.missingSoknadData.title"
        contentKey="common.soknadErrorMessages.missingSoknadData.content"
        soknadFrontpageUrl={soknadFrontpageUrl}
    />
);

const MissingApiDataError = ({ soknadFrontpageUrl }: ErrorWithFrontpageUrlProps) => (
    <SoknadErrorMessage
        titleKey="common.soknadErrorMessages.missingApiData.title"
        contentKey="common.soknadErrorMessages.missingApiData.content"
        soknadFrontpageUrl={soknadFrontpageUrl}
    />
);

const ApplicationUnavailable = () => (
    <SoknadErrorMessage
        titleKey="common.soknadErrorMessages.applicationUnavailable.title"
        contentKey="common.soknadErrorMessages.applicationUnavailable.content"
    />
);

const UnknownRoute = () => (
    <SoknadErrorMessage
        titleKey="common.soknadErrorMessages.unknownRoute.title"
        contentKey="common.soknadErrorMessages.unknownRoute.content"
    />
);

const SoknadErrorMessages = {
    ApplicationUnavailable,
    GeneralApplicationError,
    UnknownRoute,
    GeneralSoknadError,
    MissingSoknadDataError,
    MissingApiDataError,
};
export default SoknadErrorMessages;
