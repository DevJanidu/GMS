import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Modules\Attendance\Controllers\AttendanceCorrectionController::store
 * @see app/Modules/Attendance/Controllers/AttendanceCorrectionController.php:18
 * @route '/api/v1/attendance/records/{attendanceRecord}/corrections'
 */
export const store = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/attendance/records/{attendanceRecord}/corrections',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Attendance\Controllers\AttendanceCorrectionController::store
 * @see app/Modules/Attendance/Controllers/AttendanceCorrectionController.php:18
 * @route '/api/v1/attendance/records/{attendanceRecord}/corrections'
 */
store.url = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendanceRecord: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { attendanceRecord: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    attendanceRecord: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendanceRecord: typeof args.attendanceRecord === 'object'
                ? args.attendanceRecord.id
                : args.attendanceRecord,
                }

    return store.definition.url
            .replace('{attendanceRecord}', parsedArgs.attendanceRecord.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\AttendanceCorrectionController::store
 * @see app/Modules/Attendance/Controllers/AttendanceCorrectionController.php:18
 * @route '/api/v1/attendance/records/{attendanceRecord}/corrections'
 */
store.post = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Attendance\Controllers\AttendanceCorrectionController::store
 * @see app/Modules/Attendance/Controllers/AttendanceCorrectionController.php:18
 * @route '/api/v1/attendance/records/{attendanceRecord}/corrections'
 */
    const storeForm = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Attendance\Controllers\AttendanceCorrectionController::store
 * @see app/Modules/Attendance/Controllers/AttendanceCorrectionController.php:18
 * @route '/api/v1/attendance/records/{attendanceRecord}/corrections'
 */
        storeForm.post = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const corrections = {
    store: Object.assign(store, store),
}

export default corrections