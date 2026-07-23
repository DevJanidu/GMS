<?php

namespace App\Modules\Dashboard\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Dashboard\Requests\DashboardFilterRequest;
use App\Modules\Dashboard\Services\DashboardMetricsService;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private DashboardMetricsService $metrics) {}

    public function summary(DashboardFilterRequest $request): JsonResponse
    {
        $user = $request->user();

        abort_unless($this->metrics->canAccessDashboard($user), 403, 'You do not have permission to view the dashboard.');

        return ApiResponse::success($this->metrics->summary($user, $request->validated()));
    }

    public function filters(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless($this->metrics->canAccessDashboard($user), 403, 'You do not have permission to view the dashboard.');

        return ApiResponse::success($this->metrics->filterOptions($user));
    }
}
