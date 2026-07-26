import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/members/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Attendance\Controllers\AttendanceMemberSearchController::__invoke
 * @see app/Modules/Attendance/Controllers/AttendanceMemberSearchController.php:15
 * @route '/api/v1/attendance/members/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
const members = {
    search: Object.assign(search, search),
}

export default members