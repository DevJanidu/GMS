<?php

namespace App\Modules\Report\Services;

use App\Models\Branch;
use App\Modules\AccessControl\Models\AuditLog;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Refund;
use App\Modules\Membership\Models\Membership;
use App\Modules\Notification\Models\NotificationDelivery;
use App\Modules\Report\Contracts\ReportQuery;
use App\Modules\Report\DTOs\ReportContext;
use App\Modules\Report\DTOs\ReportFilters;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use InvalidArgumentException;

final class DatabaseReportQuery implements ReportQuery
{
    /** @var array<string, array{label:string,filters:list<string>}> */
    private const CATALOGUE = [
        'membership-summary' => ['label' => 'Membership Summary', 'filters' => ['date', 'branch', 'plan', 'member_status']],
        'membership-sales' => ['label' => 'Membership Sales', 'filters' => ['date', 'branch', 'plan']],
        'renewals' => ['label' => 'Renewals', 'filters' => ['date', 'branch', 'plan']],
        'expiries' => ['label' => 'Expiries', 'filters' => ['date', 'branch', 'plan']],
        'daily-attendance' => ['label' => 'Daily Attendance', 'filters' => ['date', 'branch']],
        'peak-hours' => ['label' => 'Peak Hours', 'filters' => ['date', 'branch']],
        'member-frequency' => ['label' => 'Member Frequency', 'filters' => ['date', 'branch']],
        'sales' => ['label' => 'Sales', 'filters' => ['date', 'branch', 'payment_method']],
        'collections' => ['label' => 'Collections', 'filters' => ['date', 'branch', 'payment_method']],
        'outstanding-balances' => ['label' => 'Outstanding Balances', 'filters' => ['date', 'branch']],
        'refunds' => ['label' => 'Refunds', 'filters' => ['date', 'branch', 'payment_method']],
        'staff-activity' => ['label' => 'Staff Activity', 'filters' => ['date', 'branch']],
        'notification-delivery' => ['label' => 'Notification Delivery', 'filters' => ['date', 'branch']],
        'branch-performance' => ['label' => 'Branch Performance', 'filters' => ['date', 'branch']],
    ];

    public function catalogue(): array
    {
        return collect(self::CATALOGUE)->map(
            fn (array $config, string $key) => ['key' => $key, ...$config],
        )->values()->all();
    }

    public function run(string $reportKey, ReportContext $context, ReportFilters $filters): array
    {
        if (! isset(self::CATALOGUE[$reportKey])) {
            throw new InvalidArgumentException('Unknown report key.');
        }

        $rows = match ($reportKey) {
            'membership-summary' => $this->membershipSummary($context, $filters),
            'membership-sales' => $this->memberships($context, $filters, 'sales'),
            'renewals' => $this->memberships($context, $filters, 'renewals'),
            'expiries' => $this->memberships($context, $filters, 'expiries'),
            'daily-attendance' => $this->attendanceByDay($context, $filters),
            'peak-hours' => $this->peakHours($context, $filters),
            'member-frequency' => $this->memberFrequency($context, $filters),
            'sales' => $this->sales($context, $filters),
            'collections' => $this->collections($context, $filters),
            'outstanding-balances' => $this->outstanding($context, $filters),
            'refunds' => $this->refunds($context, $filters),
            'staff-activity' => $this->staffActivity($context, $filters),
            'notification-delivery' => $this->notificationDelivery($context, $filters),
            'branch-performance' => $this->branchPerformance($context, $filters),
        };

        $total = $rows->count();
        $pageRows = $rows->slice(($filters->page - 1) * $filters->perPage, $filters->perPage)->values();

        return [
            'report_key' => $reportKey,
            'generated_at' => now()->toIso8601String(),
            'currency' => $context->currency,
            'filters' => $filters->toArray(),
            'kpis' => $this->kpis($reportKey, $rows),
            'rows' => $pageRows->all(),
            'meta' => [
                'current_page' => $filters->page, 'per_page' => $filters->perPage,
                'total' => $total, 'last_page' => max(1, (int) ceil($total / $filters->perPage)),
            ],
        ];
    }

    /** @return Collection<int, array<string, mixed>> */
    private function membershipSummary(ReportContext $context, ReportFilters $filters): Collection
    {
        return $this->membershipBase($context, $filters)
            ->whereBetween('sold_at', $this->timestampRange($filters))
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')->orderBy('status')->get()
            ->map(fn ($row) => ['status' => (string) $row->status, 'total' => (int) $row->total]);
    }

    /** @return Collection<int, array<string, mixed>> */
    private function memberships(ReportContext $context, ReportFilters $filters, string $mode): Collection
    {
        $query = $this->membershipBase($context, $filters)->with(['member:id,member_number,first_name,last_name', 'branch:id,name']);
        $dateColumn = $mode === 'expiries' ? 'expires_on' : 'sold_at';
        $query->whereBetween($dateColumn, $this->timestampRange($filters));
        if ($mode === 'renewals') {
            $query->whereNotNull('previous_membership_id');
        }

        return $query->orderBy($dateColumn)->limit(10000)->get()->map(fn (Membership $membership) => [
            'membership_id' => $membership->id,
            'member_number' => $membership->member?->member_number,
            'member_name' => $membership->member?->fullName(),
            'branch' => $membership->branch?->name,
            'plan' => $membership->plan_name_snapshot,
            'status' => $membership->status->value,
            'sold_at' => $membership->sold_at?->toIso8601String(),
            'expires_on' => $membership->expires_on->toDateString(),
            'previous_membership_id' => $membership->previous_membership_id,
        ]);
    }

    /** @return Builder<Membership> */
    private function membershipBase(ReportContext $context, ReportFilters $filters): Builder
    {
        return Membership::withoutGlobalScopes()
            ->where('tenant_id', $context->tenantId)
            ->whereIn('branch_id', $context->branchIds)
            ->when($filters->planId, fn ($q, $id) => $q->where('plan_id', $id))
            ->when(
                $filters->memberStatus,
                fn ($q, $status) => $q->whereHas('member', fn ($member) => $member->where('status', $status)),
            );
    }

    /** @return Collection<int, array<string, mixed>> */
    private function attendanceByDay(ReportContext $context, ReportFilters $filters): Collection
    {
        $days = [];
        foreach ($this->attendanceBase($context, $filters)->orderBy('id')->cursor() as $record) {
            $day = $record->checked_in_at->toImmutable()->setTimezone($context->timezone)->toDateString();
            $days[$day] ??= ['date' => $day, 'check_ins' => 0, 'still_present' => 0];
            $days[$day]['check_ins']++;
            $days[$day]['still_present'] += $record->checked_out_at === null ? 1 : 0;
        }
        ksort($days);

        return collect(array_values($days));
    }

    /** @return Collection<int, array<string, mixed>> */
    private function peakHours(ReportContext $context, ReportFilters $filters): Collection
    {
        $hours = [];
        foreach ($this->attendanceBase($context, $filters)->orderBy('id')->cursor() as $record) {
            $hour = $record->checked_in_at->toImmutable()->setTimezone($context->timezone)->hour;
            $hours[$hour] = ($hours[$hour] ?? 0) + 1;
        }
        arsort($hours);

        return collect($hours)->map(
            fn (int $visits, int $hour) => ['hour' => $hour, 'visits' => $visits],
        )->values();
    }

    /** @return Collection<int, array<string, mixed>> */
    private function memberFrequency(ReportContext $context, ReportFilters $filters): Collection
    {
        return $this->attendanceBase($context, $filters)
            ->join('members', 'members.id', '=', 'attendance_records.member_id')
            ->selectRaw('attendance_records.member_id, members.member_number, members.first_name, members.last_name, COUNT(*) as visits')
            ->groupBy('attendance_records.member_id', 'members.member_number', 'members.first_name', 'members.last_name')
            ->orderByDesc('visits')->limit(10000)->get()
            ->map(fn ($row) => [
                'member_id' => (int) $row->member_id, 'member_number' => $row->member_number,
                'member_name' => trim($row->first_name.' '.$row->last_name), 'visits' => (int) $row->visits,
            ]);
    }

    /** @return Builder<AttendanceRecord> */
    private function attendanceBase(ReportContext $context, ReportFilters $filters): Builder
    {
        return AttendanceRecord::withoutGlobalScopes()
            ->where('attendance_records.tenant_id', $context->tenantId)
            ->whereIn('attendance_records.branch_id', $context->branchIds)
            ->whereBetween('checked_in_at', $this->timestampRange($filters));
    }

    /** @return Collection<int, array<string, mixed>> */
    private function sales(ReportContext $context, ReportFilters $filters): Collection
    {
        return Invoice::withoutGlobalScopes()
            ->where('tenant_id', $context->tenantId)->whereIn('branch_id', $context->branchIds)
            ->whereBetween('issued_on', $this->timestampRange($filters))
            ->when($filters->paymentMethod, fn ($q, $method) => $q->whereHas('payments', fn ($payment) => $payment->where('method', $method)))
            ->where('status', '!=', 'void')->orderBy('issued_on')->limit(10000)->get()
            ->map(fn (Invoice $invoice) => [
                'invoice_id' => $invoice->id, 'invoice_number' => $invoice->invoice_number,
                'issued_on' => $invoice->issued_on->toDateString(), 'status' => $invoice->status->value,
                'gross_cents' => $invoice->grand_total_cents, 'paid_cents' => $invoice->amount_paid_cents,
                'refunded_cents' => $invoice->amount_refunded_cents, 'balance_cents' => $invoice->balance_due_cents,
            ]);
    }

    /** @return Collection<int, array<string, mixed>> */
    private function collections(ReportContext $context, ReportFilters $filters): Collection
    {
        $payments = Payment::withoutGlobalScopes()
            ->where('tenant_id', $context->tenantId)->whereIn('branch_id', $context->branchIds)
            ->whereBetween('paid_at', $this->timestampRange($filters))
            ->when($filters->paymentMethod, fn ($q, $method) => $q->where('method', $method))
            ->withSum('refunds', 'amount_cents')->orderBy('paid_at')->limit(10000)->get();

        return $payments->map(fn (Payment $payment) => [
            'payment_id' => $payment->id, 'payment_number' => $payment->payment_number,
            'paid_at' => $payment->paid_at->toIso8601String(), 'method' => $payment->method->value,
            'gross_cents' => $payment->amount_cents,
            'refunded_cents' => (int) ($payment->refunds_sum_amount_cents ?? 0),
            'net_cents' => $payment->amount_cents - (int) ($payment->refunds_sum_amount_cents ?? 0),
        ]);
    }

    /** @return Collection<int, array<string, mixed>> */
    private function outstanding(ReportContext $context, ReportFilters $filters): Collection
    {
        return Invoice::withoutGlobalScopes()
            ->where('tenant_id', $context->tenantId)->whereIn('branch_id', $context->branchIds)
            ->whereBetween('issued_on', $this->timestampRange($filters))
            ->where('balance_due_cents', '>', 0)->where('status', '!=', 'void')
            ->orderBy('due_on')->limit(10000)->get()
            ->map(fn (Invoice $invoice) => [
                'invoice_id' => $invoice->id, 'invoice_number' => $invoice->invoice_number,
                'due_on' => $invoice->due_on?->toDateString(), 'balance_cents' => $invoice->balance_due_cents,
                'status' => $invoice->status->value,
            ]);
    }

    /** @return Collection<int, array<string, mixed>> */
    private function refunds(ReportContext $context, ReportFilters $filters): Collection
    {
        return Refund::withoutGlobalScopes()
            ->where('tenant_id', $context->tenantId)->whereIn('branch_id', $context->branchIds)
            ->whereBetween('refunded_at', $this->timestampRange($filters))
            ->when($filters->paymentMethod, fn ($q, $method) => $q->whereHas('payment', fn ($p) => $p->where('method', $method)))
            ->with('payment:id,method')->orderBy('refunded_at')->limit(10000)->get()
            ->map(fn (Refund $refund) => [
                'refund_id' => $refund->id, 'refund_number' => $refund->refund_number,
                'refunded_at' => $refund->refunded_at->toIso8601String(),
                'amount_cents' => $refund->amount_cents, 'method' => $refund->payment->method->value,
                'reason' => $refund->reason,
            ]);
    }

    /** @return Collection<int, array<string, mixed>> */
    private function staffActivity(ReportContext $context, ReportFilters $filters): Collection
    {
        return AuditLog::withoutGlobalScopes()
            ->where('tenant_id', $context->tenantId)
            ->where(fn ($q) => $q->whereNull('branch_id')->orWhereIn('branch_id', $context->branchIds))
            ->whereBetween('created_at', $this->timestampRange($filters))
            ->selectRaw('actor_id, action, COUNT(*) as total')
            ->groupBy('actor_id', 'action')->orderByDesc('total')->get()
            ->map(fn ($row) => ['actor_id' => $row->actor_id ? (int) $row->actor_id : null, 'action' => $row->action, 'total' => (int) $row->total]);
    }

    /** @return Collection<int, array<string, mixed>> */
    private function notificationDelivery(ReportContext $context, ReportFilters $filters): Collection
    {
        return NotificationDelivery::withoutGlobalScopes()
            ->where('tenant_id', $context->tenantId)
            ->where(fn ($q) => $q->whereNull('branch_id')->orWhereIn('branch_id', $context->branchIds))
            ->whereBetween('created_at', $this->timestampRange($filters))
            ->selectRaw('channel, status, COUNT(*) as total')
            ->groupBy('channel', 'status')->orderBy('channel')->get()
            ->map(fn ($row) => ['channel' => $row->channel, 'status' => $row->status, 'total' => (int) $row->total]);
    }

    /** @return Collection<int, array<string, mixed>> */
    private function branchPerformance(ReportContext $context, ReportFilters $filters): Collection
    {
        $visits = $this->attendanceBase($context, $filters)->selectRaw('branch_id, COUNT(*) as total')->groupBy('branch_id')->pluck('total', 'branch_id');
        $payments = Payment::withoutGlobalScopes()->where('tenant_id', $context->tenantId)->whereIn('branch_id', $context->branchIds)
            ->whereBetween('paid_at', $this->timestampRange($filters))
            ->selectRaw('branch_id, SUM(amount_cents) as total')->groupBy('branch_id')->pluck('total', 'branch_id');
        $sales = Membership::withoutGlobalScopes()->where('tenant_id', $context->tenantId)->whereIn('branch_id', $context->branchIds)
            ->whereBetween('sold_at', $this->timestampRange($filters))
            ->selectRaw('branch_id, COUNT(*) as total')->groupBy('branch_id')->pluck('total', 'branch_id');

        return Branch::withoutGlobalScopes()->where('tenant_id', $context->tenantId)->whereIn('id', $context->branchIds)->orderBy('name')->get()
            ->map(fn (Branch $branch) => [
                'branch_id' => $branch->id, 'branch' => $branch->name,
                'attendance' => (int) ($visits[$branch->id] ?? 0),
                'membership_sales' => (int) ($sales[$branch->id] ?? 0),
                'collections_cents' => (int) ($payments[$branch->id] ?? 0),
            ]);
    }

    /** @param Collection<int, array<string, mixed>> $rows
     * @return array<string, int>
     */
    private function kpis(string $key, Collection $rows): array
    {
        return match ($key) {
            'sales' => ['rows' => $rows->count(), 'gross_cents' => (int) $rows->sum('gross_cents'), 'balance_cents' => (int) $rows->sum('balance_cents')],
            'collections' => ['rows' => $rows->count(), 'gross_cents' => (int) $rows->sum('gross_cents'), 'net_cents' => (int) $rows->sum('net_cents')],
            'refunds' => ['rows' => $rows->count(), 'refund_cents' => (int) $rows->sum('amount_cents')],
            'outstanding-balances' => ['rows' => $rows->count(), 'outstanding_cents' => (int) $rows->sum('balance_cents')],
            default => ['rows' => $rows->count()],
        };
    }

    /** @return array{CarbonImmutable, CarbonImmutable} */
    private function timestampRange(ReportFilters $filters): array
    {
        return [
            $filters->from->startOfDay()->utc(),
            $filters->to->endOfDay()->utc(),
        ];
    }
}
