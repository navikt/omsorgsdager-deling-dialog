import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { CheckboksPanelProps } from 'nav-frontend-skjema';
import { Arbeidssituasjon } from '../../types/SoknadFormData';

export const getArbeidssituasjonOptions = (intl: IntlShape): CheckboksPanelProps[] => [
    {
        value: Arbeidssituasjon.arbeidstaker,
        label: intlHelper(intl, `arbeidssituasjon.${Arbeidssituasjon.arbeidstaker}`),
    },
    {
        value: Arbeidssituasjon.selvstendigNæringsdrivende,
        label: intlHelper(intl, `arbeidssituasjon.${Arbeidssituasjon.selvstendigNæringsdrivende}`),
    },
    {
        value: Arbeidssituasjon.frilanser,
        label: intlHelper(intl, `arbeidssituasjon.${Arbeidssituasjon.frilanser}`),
    },
];
