import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
const AttendanceMemberSearchController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: AttendanceMemberSearchController.url(options),
    method: 'get',
})

AttendanceMemberSearchController.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/members/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
AttendanceMemberSearchController.url = (options?: RouteQueryOptions) => {
    return AttendanceMemberSearchController.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
AttendanceMemberSearchController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: AttendanceMemberSearchController.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
AttendanceMemberSearchController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: AttendanceMemberSearchController.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
    const AttendanceMemberSearchControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: AttendanceMemberSearchController.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
        AttendanceMemberSearchControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: AttendanceMemberSearchController.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
        AttendanceMemberSearchControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: AttendanceMemberSearchController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    AttendanceMemberSearchController.form = AttendanceMemberSearchControllerForm
export default AttendanceMemberSearchController