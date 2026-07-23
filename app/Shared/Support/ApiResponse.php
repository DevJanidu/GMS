<?php

namespace App\Shared\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Consistent JSON envelope for every module API, so the frontend API
 * client only has to understand one response shape.
 */
class ApiResponse
{
    public static function success(mixed $data = null, ?string $message = null, int $status = 200): JsonResponse
    {
        return response()->json(array_filter([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], fn ($value, $key) => $key !== 'data' ? $value !== null : true, ARRAY_FILTER_USE_BOTH), $status);
    }

    /**
     * @param  LengthAwarePaginator<array-key, mixed>|AbstractPaginator<array-key, mixed>  $paginator
     */
    public static function paginated(LengthAwarePaginator|AbstractPaginator $paginator, ?string $message = null): JsonResponse
    {
        return response()->json(array_filter([
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator instanceof LengthAwarePaginator ? $paginator->total() : null,
                'last_page' => $paginator instanceof LengthAwarePaginator ? $paginator->lastPage() : null,
            ],
        ], fn ($value, $key) => $key !== 'data' ? $value !== null : true, ARRAY_FILTER_USE_BOTH));
    }

    /**
     * @param  JsonResource|array<string, mixed>  $data
     */
    public static function created(JsonResource|array $data, ?string $message = 'Created successfully.'): JsonResponse
    {
        return static::success($data, $message, 201);
    }

    public static function deleted(?string $message = 'Deleted successfully.'): JsonResponse
    {
        return static::success(null, $message, 200);
    }

    /**
     * @param  array<string, mixed>|null  $errors
     */
    public static function error(string $message, int $status = 400, ?array $errors = null): JsonResponse
    {
        return response()->json(array_filter([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], fn ($value) => $value !== null), $status);
    }
}
