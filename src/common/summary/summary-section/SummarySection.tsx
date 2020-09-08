import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import './summarySection.less';

interface Props {
    header: string;
    children: React.ReactElement<any> | Array<React.ReactElement<any>> | React.ReactNode;
}

const bem = bemUtils('summarySection');

const SummarySection: React.FunctionComponent<Props> = ({ header, children }: Props) => (
    <div className={bem.block}>
        <Undertittel tag="h3" className={bem.element('header')}>
            {header}
        </Undertittel>
        {children}
    </div>
);

export default SummarySection;
