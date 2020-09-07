import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Guide from '@navikt/sif-common-core/lib/components/guide/Guide';
import VeilederSVG from '@navikt/sif-common-core/lib/components/veileder-svg/VeilederSVG';

interface Props {
    title: string;
    children: React.ReactNode;
    stillHappy?: boolean;
}

const ErrorGuide = ({ title, stillHappy, children }: Props) => (
    <Guide
        type="plakat"
        kompakt={true}
        fargetema="normal"
        svg={<VeilederSVG mood={stillHappy ? 'happy' : 'uncertain'} />}>
        <Systemtittel tag="h2">{title}</Systemtittel>
        <Box margin="m" padBottom="l">
            {children}
        </Box>
    </Guide>
);

export default ErrorGuide;
