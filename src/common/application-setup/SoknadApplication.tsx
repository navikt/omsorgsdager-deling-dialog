import React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter, Redirect } from 'react-router-dom';
import AppStatusWrapper from '@navikt/sif-common-core/lib/components/app-status-wrapper/AppStatusWrapper';
import LanguageToggle from '@navikt/sif-common-core/lib/components/language-toggle/LanguageToggle';
import ApplicationMessages from '@navikt/sif-common-core/lib/dev-utils/intl/application-messages/ApplicationMessages';
import { MessageFileFormat } from '@navikt/sif-common-core/lib/dev-utils/intl/devIntlUtils';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from '@navikt/sif-common-core/lib/utils/localeUtils';
import getSentryLoggerForApp from '@navikt/sif-common-sentry';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';
import { GlobalSoknadApplicationRoutes } from './SoknadApplicationCommonRoutes';

interface AppStatusSanityConfig {
    projectId: string;
    dataset: string;
}

interface Props {
    /** Title on app - not visual to user */
    title: string;
    /** Locale messages */
    intlMessages: MessageFileFormat;
    /** Key used in sentry logging for identifying the app in the logs */
    sentryKey?: string;
    /** Config for connecting to the appStatus sanity project */
    appStatus?: {
        applicationKey: string;
        sanityConfig: AppStatusSanityConfig;
    };
    /** The content */
    children: React.ReactNode;
    /** Public path */
    publicPath: string;
}

const localeFromSessionStorage = getLocaleFromSessionStorage();
moment.locale(localeFromSessionStorage);

const isValidAppStatusSanityConfig = (appStatus: AppStatusSanityConfig | any): appStatus is AppStatusSanityConfig =>
    appStatus !== undefined && appStatus.dataset !== undefined && appStatus.projectId !== undefined;

const SoknadApplication = ({ intlMessages: messages, title, sentryKey, appStatus, publicPath, children }: Props) => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);
    const localeMessages = messages[locale] || messages['nb'];
    const hasMultipleLocales = Object.keys(messages).length > 1;

    if (sentryKey) {
        getSentryLoggerForApp(sentryKey, ['dist/js/bundle.js']).init();
    }

    return (
        <Normaltekst tag="div">
            <IntlProvider locale={locale} messages={localeMessages}>
                {hasMultipleLocales && (
                    <LanguageToggle
                        locale={locale}
                        toggle={(activeLocale: Locale): void => {
                            setLocaleInSessionStorage(activeLocale);
                            setLocale(activeLocale);
                        }}
                    />
                )}
                <BrowserRouter basename={publicPath}>
                    {isValidAppStatusSanityConfig(appStatus) ? (
                        <AppStatusWrapper
                            applicationKey={appStatus.applicationKey}
                            sanityConfig={appStatus.sanityConfig}
                            contentRenderer={() => <>{children}</>}
                            unavailableContentRenderer={() => (
                                <Redirect to={GlobalSoknadApplicationRoutes.unavailable} />
                            )}
                        />
                    ) : (
                        <>{children}</>
                    )}
                    <ApplicationMessages messages={messages} title={title} />
                </BrowserRouter>
            </IntlProvider>
        </Normaltekst>
    );
};
export default SoknadApplication;
