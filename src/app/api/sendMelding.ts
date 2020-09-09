import { SoknadApiData } from '../types/SoknadApiData';
import api, { ApiEndpoint } from './api';

export const sendMelding = (data: SoknadApiData) => api.post(ApiEndpoint.sendMelding, data);
