import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::show
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:18
 * @route '/api/v1/attendance/settings'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::show
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:18
 * @route '/api/v1/attendance/settings'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::show
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:18
 * @route '/api/v1/attendance/settings'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::show
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:18
 * @route '/api/v1/attendance/settings'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::show
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:18
 * @route '/api/v1/attendance/settings'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::show
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:18
 * @route '/api/v1/attendance/settings'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::show
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:18
 * @route '/api/v1/attendance/settings'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::update
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:30
 * @route '/api/v1/attendance/settings'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/attendance/settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::update
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:30
 * @route '/api/v1/attendance/settings'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::update
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:30
 * @route '/api/v1/attendance/settings'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::update
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:30
 * @route '/api/v1/attendance/settings'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Attendance\Controllers\AttendanceSettingsController::update
 * @see app/Modules/Attendance/Controllers/AttendanceSettingsController.php:30
 * @route '/api/v1/attendance/settings'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const AttendanceSettingsController = { show, update }

export default AttendanceSettingsController