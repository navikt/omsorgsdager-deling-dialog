import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { jsonSort } from '../../../../common/utils/jsonSort';
import { Arbeidssituasjon, SoknadFormField } from '../../../types/SoknadFormData';
import { DinSituasjonFormData, DinSituasjonApiData, mapDinSituasjonToApiData } from '../mapDinSituasjonToApiData';

describe('mapFormDataToApiData', () => {
    describe('mapDinSituasjonToApiData', () => {
        const mockData: DinSituasjonFormData = {
            arbeiderINorge: YesOrNo.YES,
            borINorge: YesOrNo.YES,
            arbeidssituasjon: [Arbeidssituasjon.arbeidstaker],
            harBruktOmsorgsdagerEtter1Juli: YesOrNo.YES,
            antallDagerBruktEtter1Juli: 5,
        };
        it('maps standard formData correctly', () => {
            const expectedResult: DinSituasjonApiData = {
                arbeiderINorge: true,
                borINorge: true,
                antallDagerBruktEtter1Juli: 5,
                arbeidssituasjon: [Arbeidssituasjon.arbeidstaker],
            };
            const result = mapDinSituasjonToApiData(mockData);
            expect(JSON.stringify(jsonSort(result))).toEqual(JSON.stringify(jsonSort(expectedResult)));
        });
        it(`maps does not include ${SoknadFormField.antallDagerBruktEtter1Juli} if ${SoknadFormField.harBruktOmsorgsdagerEtter1Juli} === false`, () => {
            const expectedResult: DinSituasjonApiData = {
                arbeiderINorge: true,
                borINorge: true,
                arbeidssituasjon: [Arbeidssituasjon.arbeidstaker],
            };
            const result = mapDinSituasjonToApiData({ ...mockData, harBruktOmsorgsdagerEtter1Juli: YesOrNo.NO });
            expect(JSON.stringify(jsonSort(result))).toEqual(JSON.stringify(jsonSort(expectedResult)));
        });
    });
});