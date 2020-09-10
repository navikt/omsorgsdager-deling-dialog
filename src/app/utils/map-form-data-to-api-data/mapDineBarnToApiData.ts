import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';
import { mapAnnetBarnToApiBarn } from './mapUtils';

export type DineBarnFormData = Pick<SoknadFormData, SoknadFormField.andreBarn>;

export type DineBarnApiData = Pick<SoknadApiData, 'andreBarn'>;

export const mapDineBarnToApiData = ({ andreBarn }: DineBarnFormData): DineBarnApiData => {
    return {
        andreBarn: andreBarn.map(mapAnnetBarnToApiBarn),
    };
};
