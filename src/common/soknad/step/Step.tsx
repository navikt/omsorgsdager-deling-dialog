import React from 'react';
import { useIntl } from 'react-intl';
import BackLink from '@navikt/sif-common-core/lib/components/back-link/BackLink';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import { FormikValidationErrorSummary } from '@navikt/sif-common-formik/lib';
import { History } from 'history';
import { Systemtittel } from 'nav-frontend-typografi';
import { createDocumentPageTitle } from '../documentPageTitle';
import { SoknadStepsConfig } from '../soknadStepConfig';
import { getStepTexts } from '../stepUtils';
import SoknadStepIndicator from './soknad-step-indicator/SoknadStepIndicator';
import './step.less';
import StepFooter from '@navikt/sif-common-core/lib/components/step-footer/StepFooter';

const bem = bemHelper('step');

export interface StepProps {
    useValidationErrorSummary?: boolean;
    showStepIndicator?: boolean;
    topContentRenderer?: () => React.ReactElement<any>;
}

interface OwnProps<Steps> {
    stepId: Steps;
    allSteps: SoknadStepsConfig<Steps>;
    children: React.ReactNode;
    onCancel?: () => void;
    onContinueLater?: () => void;
    bannerTitle?: string;
}

type Props<Steps> = StepProps & OwnProps<Steps>;

function Step<Steps extends string>({
    stepId,
    allSteps,
    bannerTitle,
    useValidationErrorSummary,
    topContentRenderer,
    onCancel,
    onContinueLater,
    showStepIndicator = true,
    children,
}: Props<Steps>) {
    const intl = useIntl();
    const stepConfig = allSteps[stepId];
    const stepTexts = getStepTexts(intl, stepConfig);
    return (
        <Page
            className={bem.block}
            title={createDocumentPageTitle(stepTexts.pageTitle)}
            topContentRenderer={
                topContentRenderer
                    ? topContentRenderer
                    : () => (
                          <>
                              {bannerTitle && <StepBanner text={bannerTitle} />}
                              {useValidationErrorSummary !== false && <FormikValidationErrorSummary />}
                          </>
                      )
            }>
            {(showStepIndicator || stepConfig.backLinkHref) && (
                <>
                    {stepConfig.backLinkHref && (
                        <BackLink
                            href={stepConfig.backLinkHref}
                            className={bem.element('backLink')}
                            onClick={(nextHref: string, history: History, event: React.SyntheticEvent) => {
                                event.preventDefault();
                                history.push(nextHref);
                            }}
                        />
                    )}
                    <SoknadStepIndicator stepsConfig={allSteps} activeStep={stepConfig} />
                </>
            )}
            <Box margin="xxl">
                <Systemtittel className={bem.element('title')} tag="h1">
                    {stepTexts.stepTitle}
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
