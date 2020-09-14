import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CheckmarkIcon from '@navikt/sif-common-core/lib/components/checkmark-icon/CheckmarkIcon';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import './kvittering.less';

interface Props {
    tittel: string;
    liste?: {
        tittel: string;
        punkter: React.ReactNode[];
    };
    children?: React.ReactNode;
}

const Kvittering = ({ tittel, liste, children }: Props) => {
    return (
        <div className="kvittering">
            <Box textAlignCenter={true} margin="none">
                <CheckmarkIcon />
                <Box margin="xl">
                    <Innholdstittel>{tittel}</Innholdstittel>
                </Box>
            </Box>
            {liste && (
                <Box margin="xl">
                    <Ingress>{liste.tittel}</Ingress>
                    <ul className="checklist">
                        {liste.punkter.map((p, idx) => (
                            <li key={idx}>{p}</li>
                        ))}
                    </ul>
                </Box>
            )}
            {children && <Box margin="xl">{children}</Box>}
        </div>
    );
};

export default Kvittering;
