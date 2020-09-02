import React from 'react';
import { BoxMargin } from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

interface Props {
    margin?: BoxMargin;
    children: React.ReactNode;
}

const StopMessage = ({ children, margin }: Props) => (
    <FormBlock margin={margin}>
        <AlertStripeAdvarsel>{children}</AlertStripeAdvarsel>
    </FormBlock>
);

export default StopMessage;
