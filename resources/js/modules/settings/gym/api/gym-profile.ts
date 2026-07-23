import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import type { GymProfile, GymProfileFormValues } from '../types';

export const gymProfileApi = {
    get: () => apiClient.get<ApiSuccess<GymProfile>>('/gym/profile'),

    update: (values: Partial<GymProfileFormValues>) =>
        apiClient.put<ApiSuccess<GymProfile>>('/gym/profile', values),
};
