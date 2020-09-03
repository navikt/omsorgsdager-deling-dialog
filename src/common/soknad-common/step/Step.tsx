import React from 'react';
import BackLink from '@navikt/sif-common-core/lib/components/back-link/BackLink';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import StepFooter from '@navikt/sif-common-core/lib/components/step-footer/StepFooter';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import { FormikValidationErrorSummary } from '@navikt/sif-common-formik/lib';
import { History } from 'history';
import { Systemtittel } from 'nav-frontend-typografi';
import StepIndicator, { StepIndicatorStep } from '../step-indicator/StepIndicator';
import './step.less';

const bem = bemHelper('step');

interface Props {
    pageTitle: string;
    stepTitle: string;
    bannerTitle?: string;
    backLinkHref?: string;
    steps: StepIndicatorStep[];
    activeStepId: string;
    children: React.ReactNode;
    showStepIndicator?: boolean;
    useValidationErrorSummary?: boolean;
    topContentRenderer?: () => React.ReactElement<any>;
    onCancel?: () => void;
    onContinueLater?: () => void;
}

function Step({
    bannerTitle,
    pageTitle,
    stepTitle,
    backLinkHref,
    steps,
    activeStepId,
    useValidationErrorSummary,
    onCancel,
    onContinueLater,
    showStepIndicator = true,
    children,
}: Props) {
    return (
        <Page
            className={bem.block}
            title={pageTitle}
            topContentRenderer={() => (
                <>
                    {bannerTitle && <StepBanner text={bannerTitle} />}
                    {useValidationErrorSummary !== false && <FormikValidationErrorSummary />}
                </>
            )}>
            {(showStepIndicator || backLinkHref) && (
                <>
                    {backLinkHref && (
                        <BackLink
                            href={backLinkHref}
                            className={bem.element('backLink')}
                            onClick={(nextHref: string, history: History, event: React.SyntheticEvent) => {
                                event.preventDefault();
                                history.push(nextHref);
                            }}
                        />
                    )}
                    <StepIndicator steps={steps} activeStep={steps.findIndex((s) => s.id === activeStepId)} />
                </>
            )}
            <Box margin="xxl">
                <Systemtittel className={bem.element('title')} tag="h1">
                    {stepTitle}
                </Systemtittel>
            </Box>

            <Box margin="xl">{children}</Box>

            {(onCancel || onContinueLater) && (
                <StepFooter onAvbrytOgSlett={onCancel} onAvbrytOgFortsettSenere={onContinueLater} />
            )}
        </Page>
    );
}

export default Step;
