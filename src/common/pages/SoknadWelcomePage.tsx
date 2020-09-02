import React from 'react';
import Guide from '@navikt/sif-common-core/lib/components///guide/Guide';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import VeilederSVG from '@navikt/sif-common-core/lib/components/veileder-svg/VeilederSVG';

export type ResetSoknadFunction = (redirectToFrontpage: boolean) => void;

interface Props {
    pageTitle: string;
    bannerTitle: string;
    children: React.ReactNode;
    guideContentRenderer?: () => React.ReactNode;
}

const SoknadWelcomePage = ({ pageTitle, bannerTitle, guideContentRenderer, children }: Props) => {
    return (
        <Page title={pageTitle} topContentRenderer={() => <StepBanner text={bannerTitle} />}>
            <Box margin="xxxl">
                {guideContentRenderer && (
                    <Guide kompakt={true} type="plakat" svg={<VeilederSVG mood="happy" />}>
                        {guideContentRenderer()}
                    </Guide>
                )}
                <FormBlock>{children}</FormBlock>
            </Box>
        </Page>
    );
};

export default SoknadWelcomePage;
