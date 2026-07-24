import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::store
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:21
 * @route '/api/v1/attendance/scans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/attendance/scans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::store
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:21
 * @route '/api/v1/attendance/scans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::store
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:21
 * @route '/api/v1/attendance/scans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::store
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:21
 * @route '/api/v1/attendance/scans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::store
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:21
 * @route '/api/v1/attendance/scans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::recent
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:54
 * @route '/api/v1/attendance/scans/recent'
 */
export const recent = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recent.url(options),
    method: 'get',
})

recent.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/scans/recent',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::recent
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:54
 * @route '/api/v1/attendance/scans/recent'
 */
recent.url = (options?: RouteQueryOptions) => {
    return recent.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::recent
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:54
 * @route '/api/v1/attendance/scans/recent'
 */
recent.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recent.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::recent
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:54
 * @route '/api/v1/attendance/scans/recent'
 */
recent.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recent.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::recent
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:54
 * @route '/api/v1/attendance/scans/recent'
 */
    const recentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: recent.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::recent
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:54
 * @route '/api/v1/attendance/scans/recent'
 */
        recentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recent.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Attendance\Controllers\AttendanceScanController::recent
 * @see app/Modules/Attendance/Controllers/AttendanceScanController.php:54
 * @route '/api/v1/attendance/scans/recent'
 */
        recentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recent.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    recent.form = recentForm
const AttendanceScanController = { store, recent }

export default AttendanceScanController