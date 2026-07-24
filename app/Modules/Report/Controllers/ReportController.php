<?php

namespace App\Modules\Report\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Report\Contracts\ReportQuery;
use App\Modules\Report\DTOs\ReportFilters;
use App\Modules\Report\Requests\ReportFilterRequest;
use App\Modules\Report\Services\OperationalDashboardService;
use App\Modules\Report\Services\ReportAuthorizer;
use App\Shared\Support\ApiResponse;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function catalogue(Request $request, ReportQuery $reports, ReportAuthorizer $authorizer): JsonResponse
    {
        abort_unless($authorizer->can($request->user(), 'reports.view'), 403);
        $visible = collect($reports->catalogue())->filter(
            fn (array $report) => $authorizer->can($request->user(), (string) $authorizer->permissionFor($report['key'])),
        )->values();

        return ApiResponse::success($visible);
    }

    public function show(string $reportKey, ReportFilterRequest $request, ReportQuery $reports, ReportAuthorizer $authorizer): JsonResponse
    {
        $authorizer->authorizeReport($request->user(), $reportKey);
        $context = $authorizer->context($request->user(), $request->integer('branch_id') ?: null);

        return ApiResponse::success($reports->run($reportKey, $context, $this->filters($request, $context->timezone)));
    }

    public function print(string $reportKey, ReportFilterRequest $request, ReportQuery $reports, ReportAuthorizer $authorizer): JsonResponse
    {
        $authorizer->authorizeReport($request->user(), $reportKey);
        $context = $authorizer->context($request->user(), $request->integer('branch_id') ?: null);
        $data = $reports->run($reportKey, $context, $this->filters($request, $context->timezone));
        $data['print_friendly'] = true;

        return ApiResponse::success($data);
    }

    public function operational(Request $request, ReportAuthorizer $authorizer, OperationalDashboardService $dashboard): JsonResponse
    {
        abort_unless($authorizer->can($request->user(), 'dashboard.view'), 403);
        $branchId = $request->integer('branch_id') ?: null;
        $context = $authorizer->context($request->user(), $branchId);

        return ApiResponse::success($dashboard->build(
            $context,
            $authorizer->can($request->user(), 'reports.financial.view')
                || $authorizer->can($request->user(), 'dashboard.financials.view'),
        ));
    }

    private function filters(ReportFilterRequest $request, string $timezone): ReportFilters
    {
        return new ReportFilters(
            CarbonImmutable::parse($request->validated('date_from') ?? now()->subDays(30), $timezone),
            CarbonImmutable::parse($request->validated('date_to') ?? now(), $timezone),
            $request->integer('branch_id') ?: null,
            $request->integer('plan_id') ?: null,
            $request->validated('member_status'),
            $request->validated('payment_method'),
            $request->integer('page', 1),
            $request->integer('per_page', 20),
        );
    }
}
