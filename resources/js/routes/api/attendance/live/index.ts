import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/live',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const live = {
    index: Object.assign(index, index),
}

export default live