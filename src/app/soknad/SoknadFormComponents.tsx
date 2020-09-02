import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { SoknadFormField, SoknadFormData } from '../types/SoknadFormData';

const SoknadFormComponents = getTypedFormComponents<SoknadFormField, SoknadFormData>();

export default SoknadFormComponents;
