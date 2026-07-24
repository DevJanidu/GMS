import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
const LiveAttendanceController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: LiveAttendanceController.url(options),
    method: 'get',
})

LiveAttendanceController.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/live',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
LiveAttendanceController.url = (options?: RouteQueryOptions) => {
    return LiveAttendanceController.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
LiveAttendanceController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: LiveAttendanceController.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
LiveAttendanceController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: LiveAttendanceController.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
    const LiveAttendanceControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: LiveAttendanceController.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
        LiveAttendanceControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: LiveAttendanceController.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Attendance\Controllers\LiveAttendanceController::__invoke
 * @see app/Modules/Attendance/Controllers/LiveAttendanceController.php:21
 * @route '/api/v1/attendance/live'
 */
        LiveAttendanceControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: LiveAttendanceController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    LiveAttendanceController.form = LiveAttendanceControllerForm
export default LiveAttendanceController