import React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import AppStatusWrapper from '@sif-common-core/components/app-status-wrapper/AppStatusWrapper';
import LanguageToggle from '@sif-common-core/components/language-toggle/LanguageToggle';
import ApplicationMessages from '@sif-common-core/dev-utils/intl/application-messages/ApplicationMessages';
import { MessageFileFormat } from '@sif-common-core/dev-utils/intl/devIntlUtils';
import { Locale } from '@sif-common-core/types/Locale';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from '@sif-common-core/utils/localeUtils';
import getSentryLoggerForApp from '@navikt/sif-common-sentry/lib';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';
import { GlobalSoknadApplicationRoutes } from './SoknadApplicationRoutes';
import '@sif-common-core/styles/globalStyles.less';

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
}

const localeFromSessionStorage = getLocaleFromSessionStorage();
moment.locale(localeFromSessionStorage);

const isValidAppStatusSanityConfig = (appStatus: AppStatusSanityConfig | any): appStatus is AppStatusSanityConfig =>
    appStatus !== undefined && appStatus.dataset !== undefined && appStatus.projectId !== undefined;

const SoknadApplication = ({ intlMessages: messages, title, sentryKey, appStatus, children }: Props) => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);
    const localeMessages = messages[locale] || messages['nb'];
    const hasMultipleLocales = Object.keys(messages).length > 1;

    if (sentryKey) {
        getSentryLoggerForApp(sentryKey).init();
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
                <Router>
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
                </Router>
            </IntlProvider>
        </Normaltekst>
    );
};
export default SoknadApplication;
