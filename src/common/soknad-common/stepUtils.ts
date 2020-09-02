import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SoknadStepConfig } from './soknadStepConfig';

interface StepTexts {
    pageTitle: string;
    stepTitle: string;
    nextButtonLabel: string;
}

export const getStepTexts = <Step>(intl: IntlShape, stepConfig: SoknadStepConfig<Step>): StepTexts => {
    return {
        pageTitle: intlHelper(intl, stepConfig.pageTitleIntlKey),
        stepTitle: intlHelper(intl, stepConfig.stepTitleIntlKey),
        nextButtonLabel: intlHelper(intl, stepConfig.nextButtonLabelIntlKey),
    };
};
