import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Attendance\Controllers\ManualAttendanceController::store
 * @see app/Modules/Attendance/Controllers/ManualAttendanceController.php:19
 * @route '/api/v1/attendance/manual'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/attendance/manual',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Attendance\Controllers\ManualAttendanceController::store
 * @see app/Modules/Attendance/Controllers/ManualAttendanceController.php:19
 * @route '/api/v1/attendance/manual'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\ManualAttendanceController::store
 * @see app/Modules/Attendance/Controllers/ManualAttendanceController.php:19
 * @route '/api/v1/attendance/manual'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Attendance\Controllers\ManualAttendanceController::store
 * @see app/Modules/Attendance/Controllers/ManualAttendanceController.php:19
 * @route '/api/v1/attendance/manual'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Attendance\Controllers\ManualAttendanceController::store
 * @see app/Modules/Attendance/Controllers/ManualAttendanceController.php:19
 * @route '/api/v1/attendance/manual'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const ManualAttendanceController = { store }

export default ManualAttendanceController