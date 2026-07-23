import { apiClient } from '@/lib/api/client';
import type { ApiSuccess } from '@/lib/api/client';
import type { GymProfile, GymProfileFormValues } from '../types';

function toFormData(values: Partial<GymProfileFormValues>): FormData {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
        if (key === 'logo') {
            if (value instanceof File) {
                formData.append('logo', value);
            }

            continue;
        }

        if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    }

    return formData;
}

export const gymProfileApi = {
    get: () => apiClient.get<ApiSuccess<GymProfile>>('/gym/profile'),

    update: (values: Partial<GymProfileFormValues>) =>
        apiClient.putForm<ApiSuccess<GymProfile>>(
            '/gym/profile',
            toFormData(values),
        ),
};
