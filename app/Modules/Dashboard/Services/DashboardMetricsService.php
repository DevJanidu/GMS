<?php

namespace App\Modules\Dashboard\Services;

use App\Enums\MemberStatus;
use App\Models\Branch;
use App\Models\Member;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Aggregates dashboard read-models from data this worktree is allowed to
 * touch directly (members, branches). Membership and billing figures
 * (revenue, outstanding balances, recent payments, renewals, expiring/
 * expired memberships) have no published contract yet in this baseline —
 * see INTEGRATION_NOTES.md. Those sections are returned with a
 * `pending_integration` status instead of invented numbers or direct
 * queries against another module's tables.
 */
class DashboardMetricsService
{
    private const DEFAULT_RANGE_DAYS = 30;

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

        $pendingIntegrationReason = 'Membership and billing data is not yet available. '
            .'The Phase 2 membership-lifecycle and billing-payments worktrees have not published '
            .'their APIs or domain events yet — see INTEGRATION_NOTES.md.';

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
                    'status' => 'pending_integration',
                    'message' => $pendingIntegrationReason,
                ],
                'expired' => [
                    'status' => 'pending_integration',
                    'message' => $pendingIntegrationReason,
                ],
            ],
            'financials' => [
                'revenue' => $this->restrictedOrPending($canViewFinancials, $pendingIntegrationReason),
                'outstanding' => $this->restrictedOrPending($canViewFinancials, $pendingIntegrationReason),
            ],
            'recentPayments' => $canViewFinancials
                ? ['status' => 'pending_integration', 'message' => $pendingIntegrationReason]
                : ['status' => 'restricted', 'message' => 'You do not have permission to view financial data.'],
            'renewalSummary' => [
                'status' => 'pending_integration',
                'message' => $pendingIntegrationReason,
            ],
            'branchComparison' => [
                'status' => 'available',
                'data' => $this->branchComparison($branchIds),
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
    private function branchComparison(Collection $branchIds): array
    {
        $activeCounts = Member::query()
            ->whereIn('branch_id', $branchIds)
            ->where('status', MemberStatus::Active->value)
            ->selectRaw('branch_id, count(*) as active_count')
            ->groupBy('branch_id')
            ->pluck('active_count', 'branch_id');

        return array_values(Branch::query()
            ->whereIn('id', $branchIds)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Branch $branch) => [
                'branchId' => $branch->id,
                'branchName' => $branch->name,
                'activeMembers' => (int) ($activeCounts[$branch->id] ?? 0),
                'revenue' => null,
            ])
            ->all());
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
     * @return array<string, mixed>
     */
    private function restrictedOrPending(bool $canViewFinancials, string $pendingReason): array
    {
        if (! $canViewFinancials) {
            return ['status' => 'restricted', 'message' => 'You do not have permission to view financial data.'];
        }

        return ['status' => 'pending_integration', 'message' => $pendingReason];
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
