import { verifySoknadApiData } from '../verifySoknadApiData';

const mockSoknad = {
    id: '01EN0G1TQF4N58300JZ6V0NN22',
    språk: 'nb',
    harBekreftetOpplysninger: true,
    harForståttRettigheterOgPlikter: true,
    erYrkesaktiv: true,
    arbeiderINorge: true,
    arbeidssituasjon: ['selvstendigNæringsdrivende'],
    antallDagerSomSkalOverføres: '3',
    mottakerType: 'samboer',
    mottakerFnr: '1234567891',
    mottakerNavn: 'sddfsdf',
    harAleneomsorg: true,
    harUtvidetRett: true,
    barn: [
        {
            navn: 'Filip Barne Carpenter',
            fødselsdato: '2003-01-01',
            aktørId: '1',
            aleneOmOmsorgen: true,
            utvidetRett: true,
        },
        {
            navn: 'Jason Mcmanus',
            fødselsdato: '2004-01-02',
            aktørId: '2',
            aleneOmOmsorgen: false,
            utvidetRett: false,
        },
    ],
};

describe('verifySoknadApiData', () => {
    it('fails on undefined data', () => {
        expect(verifySoknadApiData(undefined)).toBeFalsy();
    });
    it('accepts valid data', () => {
        expect(verifySoknadApiData(mockSoknad)).toBeTruthy();
    });
});
