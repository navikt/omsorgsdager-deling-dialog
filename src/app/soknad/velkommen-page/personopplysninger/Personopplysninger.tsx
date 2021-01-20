import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Lenke from 'nav-frontend-lenker';
import { Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import getLenker from '../../../lenker';

const getText = (part: string): React.ReactNode => <FormattedMessage id={`modal.personopplysninger.${part}`} />;

const BehandlingAvPersonopplysningerContent: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <>
            <Systemtittel>{getText('tittel')}</Systemtittel>

            <Box margin="l">
                <Normaltekst>{getText('intro.1')}</Normaltekst>
            </Box>
            <Box margin="xl">
                <Ingress>{getText('opplysninger.tittel')}</Ingress>
                <Normaltekst>
                    {getText('opplysninger.part1')}
                    <ul>
                        <li>{getText('opplysninger.1')}</li>
                        <li>{getText('opplysninger.2')}</li>
                        <li>{getText('opplysninger.3')}</li>
                        <li>{getText('opplysninger.4')}</li>
                        <li>{getText('opplysninger.5')}</li>
                        <li>{getText('opplysninger.6')}</li>
                    </ul>
                    {getText('opplysninger.part2')}

                    <ul>
                        <li>{getText('opplysninger.7')}</li>
                        <li>{getText('opplysninger.8')}</li>
                    </ul>
                </Normaltekst>
            </Box>

            <Box margin="xl">
                <Ingress>{getText('svar.tittel')}</Ingress>
                <Normaltekst>{getText('svar.part1a')}</Normaltekst>
            </Box>

            <Box margin="xl">
                <Normaltekst>
                    {getText('svar.part1b')}{' '}
                    <Lenke href={getLenker(intl.locale).personvern} target="_blank">
                        {getText('svar.part1c')}
                    </Lenke>
                    .
                </Normaltekst>
            </Box>
        </>
    );
};

export default BehandlingAvPersonopplysningerContent;
