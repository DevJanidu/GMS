import type { Phase3OperationalSnapshot } from '../types';

export type OperationalDashboardParams = {
    dateFrom: string;
    dateTo: string;
    branchId: number | null;
};

export interface OperationalDashboardDataSource {
    load(
        params: OperationalDashboardParams,
    ): Promise<Phase3OperationalSnapshot>;
}

class UnavailableOperationalDashboardDataSource implements OperationalDashboardDataSource {
    load(): Promise<Phase3OperationalSnapshot> {
        return Promise.reject(
            new Error(
                'Attendance and notification operational APIs are awaiting final integration.',
            ),
        );
    }
}

/**
 * W2 and W3 replace this integration seam with their real API composition.
 * The fallback produces no operational values or mock records.
 */
export const operationalDashboardDataSource: OperationalDashboardDataSource =
    new UnavailableOperationalDashboardDataSource();
