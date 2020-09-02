import React from 'react';
import { BoxMargin } from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

interface Props {
    margin?: BoxMargin;
    children: React.ReactNode;
}

const InfoMessage = ({ margin, children }: Props) => (
    <FormBlock margin={margin}>
        <AlertStripeInfo>{children}</AlertStripeInfo>
    </FormBlock>
);

export default InfoMessage;
