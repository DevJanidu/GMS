<?php

namespace App\Modules\Dashboard\Services;

use App\Enums\MemberStatus;
use App\Models\Branch;
use App\Models\Member;
use App\Models\User;
use App\Modules\Billing\Enums\InvoiceStatus;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Models\Membership;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Aggregates dashboard read-models. Member/branch figures are queried
 * directly (owned by this worktree); membership and billing figures are
 * read from the `Membership`/`Billing` modules' own tables now that both
 * have landed on `dev` (see INTEGRATION_NOTES.md's "Action needed at Phase
 * 2 integration merge" note) — this service still never writes to those
 * tables, only reads.
 */
class DashboardMetricsService
{
    private const DEFAULT_RANGE_DAYS = 30;

    private const RECENT_PAYMENTS_LIMIT = 6;

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function summary(User $user, array $filters): array
    {
        $dateFrom = $this->resolveDateFrom($filters);
        $dateTo = $this->resolveDateTo($filters);
        $branchIds = $this->resolveBranchScope($user, $filters['branch_id'] ?? null);
        $canViewFinancials = $this->canViewFinancials($user);

        $restrictedFinancials = ['status' => 'restricted', 'message' => 'You do not have permission to view financial data.'];

        return [
            'meta' => [
                'dateFrom' => $dateFrom->toDateString(),
                'dateTo' => $dateTo->toDateString(),
                'branchId' => $filters['branch_id'] ?? null,
                'currency' => $user->tenant->currency,
                'generatedAt' => CarbonImmutable::now()->toIso8601String(),
            ],
            'members' => [
                'active' => [
                    'status' => 'available',
                    'data' => ['count' => $this->activeMemberCount($branchIds)],
                ],
                'new' => [
                    'status' => 'available',
                    'data' => ['count' => $this->newMemberCount($branchIds, $dateFrom, $dateTo)],
                ],
                'expiring' => [
                    'status' => 'available',
                    'data' => ['count' => $this->expiringMembershipCount($branchIds)],
                ],
                'expired' => [
                    'status' => 'available',
                    'data' => ['count' => $this->expiredMembershipCount($branchIds)],
                ],
            ],
            'financials' => [
                'revenue' => $canViewFinancials
                    ? ['status' => 'available', 'data' => ['amount' => $this->revenue($branchIds, $dateFrom, $dateTo)]]
                    : $restrictedFinancials,
                'outstanding' => $canViewFinancials
                    ? ['status' => 'available', 'data' => ['amount' => $this->outstandingBalance($branchIds)]]
                    : $restrictedFinancials,
            ],
            'recentPayments' => $canViewFinancials
                ? ['status' => 'available', 'data' => ['items' => $this->recentPayments($branchIds)]]
                : $restrictedFinancials,
            'renewalSummary' => [
                'status' => 'available',
                'data' => $this->renewalSummary($branchIds, $dateFrom, $dateTo),
            ],
            'branchComparison' => [
                'status' => 'available',
                'data' => $this->branchComparison($branchIds, $dateFrom, $dateTo, $canViewFinancials),
            ],
            'recentActivity' => [
                'status' => 'available',
                'data' => $this->recentActivity($branchIds),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function filterOptions(User $user): array
    {
        $branchIds = $this->accessibleBranchIds($user);

        return [
            'branches' => Branch::query()
                ->whereIn('id', $branchIds)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Branch $branch) => ['id' => $branch->id, 'name' => $branch->name])
                ->values(),
            'defaultRange' => [
                'dateFrom' => CarbonImmutable::now()->subDays(self::DEFAULT_RANGE_DAYS)->toDateString(),
                'dateTo' => CarbonImmutable::now()->toDateString(),
            ],
        ];
    }

    public function canAccessDashboard(User $user): bool
    {
        return $user->hasRole('owner') || $user->hasPermission('dashboard.view');
    }

    public function canViewFinancials(User $user): bool
    {
        return $user->hasRole('owner') || $user->hasPermission('dashboard.financials.view');
    }

    /**
     * All branch ids in scope for the given filter, or 403 if the caller
     * explicitly asked for a branch they cannot access.
     *
     * @return Collection<int, int>
     */
    private function resolveBranchScope(User $user, ?int $requestedBranchId): Collection
    {
        $accessible = $this->accessibleBranchIds($user);

        if ($requestedBranchId === null) {
            return $accessible;
        }

        abort_unless($accessible->contains($requestedBranchId), 403, 'You do not have access to this branch.');

        return collect([$requestedBranchId]);
    }

    /**
     * @return Collection<int, int>
     */
    private function accessibleBranchIds(User $user): Collection
    {
        if ($user->hasRole('owner')) {
            return Branch::query()->pluck('id');
        }

        return $user->branches()->pluck('branches.id');
    }

    /**
     * @param  Collection<int, int>  $branchIds
     */
    private function activeMemberCount(Collection $branchIds): int
    {
        return Member::query()
            ->whereIn('branch_id', $branchIds)
            ->where('status', MemberStatus::Active->value)
            ->count();
    }

    /**
     * @param  Collection<int, int>  $branchIds
     */
    private function newMemberCount(Collection $branchIds, CarbonImmutable $dateFrom, CarbonImmutable $dateTo): int
    {
        // `joined_at` is a `date` cast but persists with a time component
        // (e.g. "2026-07-23 00:00:00"), so a bare `toDateString()` upper
        // bound would lexicographically exclude same-day rows — widen to
        // the full day.
        return Member::query()
            ->whereIn('branch_id', $branchIds)
            ->whereBetween('joined_at', [$dateFrom->startOfDay(), $dateTo->endOfDay()])
            ->count();
    }

    /**
     * @param  Collection<int, int>  $branchIds
     * @return list<array<string, mixed>>
     */
    private function branchComparison(
        Collection $branchIds,
        CarbonImmutable $dateFrom,
        CarbonImmutable $dateTo,
        bool $canViewFinancials,
    ): array
    {
        $activeCounts = Member::query()
            ->whereIn('branch_id', $branchIds)
            ->where('status', MemberStatus::Active->value)
            ->selectRaw('branch_id, count(*) as active_count')
            ->groupBy('branch_id')
            ->pluck('active_count', 'branch_id');

        $revenueByBranch = $canViewFinancials
            ? Payment::query()
                ->whereIn('branch_id', $branchIds)
                ->whereBetween('paid_at', [$dateFrom->startOfDay(), $dateTo->endOfDay()])
                ->selectRaw('branch_id, sum(amount_cents) as total_cents')
                ->groupBy('branch_id')
                ->pluck('total_cents', 'branch_id')
            : collect();

        return array_values(Branch::query()
            ->whereIn('id', $branchIds)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Branch $branch) => [
                'branchId' => $branch->id,
                'branchName' => $branch->name,
                'activeMembers' => (int) ($activeCounts[$branch->id] ?? 0),
                'revenue' => $canViewFinancials
                    ? ((int) ($revenueByBranch[$branch->id] ?? 0)) / 100
                    : null,
            ])
            ->all());
    }

    /**
     * @param  Collection<int, int>  $branchIds
     */
    private function expiringMembershipCount(Collection $branchIds): int
    {
        $today = CarbonImmutable::now()->startOfDay();
        $threshold = $today->addDays((int) config('membership.expiring_soon_within_days'));

        return Membership::query()
            ->whereIn('branch_id', $branchIds)
            ->where('status', MembershipStatus::Active)
            ->whereDate('expires_on', '>=', $today->toDateString())
            ->whereDate('expires_on', '<=', $threshold->toDateString())
            ->whereDoesntHave('renewal')
            ->count();
    }

    /**
     * @param  Collection<int, int>  $branchIds
     */
    private function expiredMembershipCount(Collection $branchIds): int
    {
        return Membership::query()
            ->whereIn('branch_id', $branchIds)
            ->where('status', MembershipStatus::Expired)
            ->count();
    }

    /**
     * @param  Collection<int, int>  $branchIds
     */
    private function revenue(Collection $branchIds, CarbonImmutable $dateFrom, CarbonImmutable $dateTo): float
    {
        $totalCents = Payment::query()
            ->whereIn('branch_id', $branchIds)
            ->whereBetween('paid_at', [$dateFrom->startOfDay(), $dateTo->endOfDay()])
            ->sum('amount_cents');

        return ((int) $totalCents) / 100;
    }

    /**
     * @param  Collection<int, int>  $branchIds
     */
    private function outstandingBalance(Collection $branchIds): float
    {
        $totalCents = Invoice::query()
            ->whereIn('branch_id', $branchIds)
            ->whereNotIn('status', [InvoiceStatus::Void, InvoiceStatus::Paid, InvoiceStatus::Refunded])
            ->sum('balance_due_cents');

        return ((int) $totalCents) / 100;
    }

    /**
     * @param  Collection<int, int>  $branchIds
     * @return list<array<string, mixed>>
     */
    private function recentPayments(Collection $branchIds): array
    {
        return array_values(Payment::query()
            ->whereIn('branch_id', $branchIds)
            ->with(['invoice.member', 'invoice.items'])
            ->latest('paid_at')
            ->limit(self::RECENT_PAYMENTS_LIMIT)
            ->get()
            ->map(fn (Payment $payment) => [
                'id' => $payment->public_id,
                'member' => $payment->invoice->member?->fullName() ?? '—',
                'plan' => optional($payment->invoice->items->first())->description ?? '—',
                'amount' => $payment->amount_cents / 100,
                'status' => $payment->invoice->status->value,
            ])
            ->all());
    }

    /**
     * @param  Collection<int, int>  $branchIds
     * @return array<string, int>
     */
    private function renewalSummary(Collection $branchIds, CarbonImmutable $dateFrom, CarbonImmutable $dateTo): array
    {
        $today = CarbonImmutable::now()->startOfDay();

        $renewed = Membership::query()
            ->whereIn('branch_id', $branchIds)
            ->whereNotNull('previous_membership_id')
            ->whereBetween('sold_at', [$dateFrom->startOfDay(), $dateTo->endOfDay()])
            ->count();

        $dueSoon = Membership::query()
            ->whereIn('branch_id', $branchIds)
            ->where('status', MembershipStatus::Active)
            ->whereDate('expires_on', '>=', $today->toDateString())
            ->whereDate('expires_on', '<=', $dateTo->toDateString())
            ->whereDoesntHave('renewal')
            ->count();

        $overdue = Membership::query()
            ->whereIn('branch_id', $branchIds)
            ->where('status', MembershipStatus::Active)
            ->whereDate('expires_on', '<', $today->toDateString())
            ->whereDate('grace_ends_on', '>=', $today->toDateString())
            ->whereDoesntHave('renewal')
            ->count();

        return ['renewed' => $renewed, 'dueSoon' => $dueSoon, 'overdue' => $overdue];
    }

    /**
     * @param  Collection<int, int>  $branchIds
     * @return list<array<string, mixed>>
     */
    private function recentActivity(Collection $branchIds): array
    {
        return array_values(Member::query()
            ->whereIn('branch_id', $branchIds)
            ->with('branch')
            ->latest('created_at')
            ->limit(6)
            ->get()
            ->map(fn (Member $member) => [
                'type' => 'member_registered',
                'title' => 'New member joined',
                'detail' => trim($member->fullName().($member->branch ? " · {$member->branch->name}" : '')),
                'occurredAt' => $member->created_at?->toIso8601String(),
            ])
            ->all());
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function resolveDateFrom(array $filters): CarbonImmutable
    {
        return isset($filters['date_from'])
            ? CarbonImmutable::parse($filters['date_from'])
            : CarbonImmutable::now()->subDays(self::DEFAULT_RANGE_DAYS);
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function resolveDateTo(array $filters): CarbonImmutable
    {
        return isset($filters['date_to'])
            ? CarbonImmutable::parse($filters['date_to'])
            : CarbonImmutable::now();
    }
}
