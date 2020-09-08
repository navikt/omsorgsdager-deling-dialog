import { SoknadApiData } from '../../types/SoknadApiData';
import { SoknadFormData, SoknadFormField } from '../../types/SoknadFormData';

export type DineBarnFormData = Pick<SoknadFormData, SoknadFormField.andreBarn>;

export type DineBarnApiData = Pick<SoknadApiData, 'andreBarn'>;

export const mapDineBarnToApiData = (formData: DineBarnFormData): DineBarnApiData => {
    return {
        andreBarn: formData.andreBarn,
    };
};
