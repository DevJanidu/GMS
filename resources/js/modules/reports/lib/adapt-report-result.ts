import { formatCurrency } from '@/lib/utils';
import type { ReportResult as BackendReportResult } from '../api/reports';
import type { ReportKey, ReportResult } from '../types';
import { formatDateValue, formatHour, humanize } from './format';
import {
    KPI_LABELS,
    REPORT_CHARTS,
    REPORT_COLUMNS,
} from './report-view-config';
import type { ColumnFormat } from './report-view-config';

function formatCell(
    value: unknown,
    format: ColumnFormat | undefined,
    currency: string,
): string | number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    switch (format) {
        case 'money':
            return formatCurrency(Number(value) / 100, currency);
        case 'date':
            return formatDateValue(value);
        case 'datetime':
            return formatDateValue(value, true);
        case 'hour':
            return formatHour(value);
        case 'number':
            return typeof value === 'number'
                ? value.toLocaleString()
                : String(value);
        default:
            return value as string | number;
    }
}

export function adaptReportResult(
    key: ReportKey,
    title: string,
    backend: BackendReportResult,
): ReportResult {
    const columns = REPORT_COLUMNS[key];

    const kpis = Object.entries(backend.kpis).map(([kpiKey, value]) => {
        const config = KPI_LABELS[kpiKey] ?? { label: humanize(kpiKey) };
        const isMoney = kpiKey.endsWith('_cents');

        return {
            key: kpiKey,
            label: config.label,
            value: isMoney
                ? formatCurrency(value / 100, backend.currency)
                : value.toLocaleString(),
            helper: config.helper,
        };
    });

    const chartSpec = REPORT_CHARTS[key];
    const chart =
        chartSpec && backend.rows.length > 0
            ? {
                  label_key: chartSpec.label_key,
                  value_key: chartSpec.value_key,
                  value_label: chartSpec.value_label,
                  items: backend.rows.map((row) => ({
                      [chartSpec.label_key]: row[chartSpec.label_key] as
                          string | number,
                      [chartSpec.value_key]: Number(
                          row[chartSpec.value_key] ?? 0,
                      ),
                  })),
              }
            : null;

    return {
        key,
        title,
        generated_at: backend.generated_at,
        kpis,
        chart,
        table: {
            columns: columns.map(({ key: columnKey, label, align }) => ({
                key: columnKey,
                label,
                align,
            })),
            rows: backend.rows.map((row) => {
                const out: Record<string, string | number | null> = {};

                for (const column of columns) {
                    out[column.key] = formatCell(
                        row[column.key],
                        column.format,
                        backend.currency,
                    );
                }

                return out;
            }),
        },
        meta: backend.meta,
    };
}
