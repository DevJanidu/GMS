import { afterEach, describe, expect, it, vi } from 'vitest';
import { attendanceApi } from './attendance';

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('attendanceApi', () => {
    it('sends the stable scan contract with an authorized branch hint', async () => {
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(
                JSON.stringify({
                    success: true,
                    data: {
                        result: 'checked_in',
                        attendance_record_id: 10,
                        member: {
                            id: 4,
                            member_number: 'MEM-4',
                            display_name: 'Test Member',
                        },
                        checked_in_at: '2026-07-24T10:00:00+05:30',
                        replayed: false,
                        override_applied: false,
                    },
                }),
                { status: 200 },
            ),
        );
        vi.stubGlobal('fetch', fetchMock);

        const input = {
            qr_token: 'opaque-token',
            request_id: '803e5e9a-dd49-40d3-8443-e372568bfa93',
            source: 'phone_camera' as const,
            device_id: 'front-desk-phone',
            action: 'auto' as const,
        };
        const response = await attendanceApi.scan(input, 12);

        expect(response.data.result).toBe('checked_in');
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/attendance/scans?branch_id=12',
            expect.objectContaining({
                method: 'POST',
                credentials: 'same-origin',
                body: JSON.stringify(input),
            }),
        );
    });

    it('preserves the safe rejection reason map from the API envelope', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(
                new Response(
                    JSON.stringify({
                        success: false,
                        message: 'Membership has expired.',
                        errors: {
                            reason_code: ['membership_expired'],
                        },
                    }),
                    { status: 422 },
                ),
            ),
        );

        await expect(
            attendanceApi.scan({
                qr_token: 'opaque-token',
                request_id: '48e2be00-184e-4553-bec0-77b2cba7903b',
                source: 'phone_camera',
            }),
        ).rejects.toMatchObject({
            status: 422,
            message: 'Membership has expired.',
            errors: { reason_code: ['membership_expired'] },
        });
    });

    it('caps history inputs in the backend contract and preserves pagination metadata', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(
                new Response(
                    JSON.stringify({
                        success: true,
                        data: [],
                        meta: {
                            current_page: 2,
                            per_page: 20,
                            total: 21,
                            last_page: 2,
                        },
                    }),
                    { status: 200 },
                ),
            ),
        );

        const response = await attendanceApi.records('page=2&per_page=20');

        expect(response.meta).toEqual({
            current_page: 2,
            per_page: 20,
            total: 21,
            last_page: 2,
        });
    });
});
