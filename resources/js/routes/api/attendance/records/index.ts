import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::index
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:19
 * @route '/api/v1/attendance/records'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/records',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::index
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:19
 * @route '/api/v1/attendance/records'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::index
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:19
 * @route '/api/v1/attendance/records'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::index
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:19
 * @route '/api/v1/attendance/records'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::index
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:19
 * @route '/api/v1/attendance/records'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::index
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:19
 * @route '/api/v1/attendance/records'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::index
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:19
 * @route '/api/v1/attendance/records'
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
/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::show
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:54
 * @route '/api/v1/attendance/records/{attendanceRecord}'
 */
export const show = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/records/{attendanceRecord}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::show
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:54
 * @route '/api/v1/attendance/records/{attendanceRecord}'
 */
show.url = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{attendanceRecord}', parsedArgs.attendanceRecord.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::show
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:54
 * @route '/api/v1/attendance/records/{attendanceRecord}'
 */
show.get = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::show
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:54
 * @route '/api/v1/attendance/records/{attendanceRecord}'
 */
show.head = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::show
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:54
 * @route '/api/v1/attendance/records/{attendanceRecord}'
 */
    const showForm = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::show
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:54
 * @route '/api/v1/attendance/records/{attendanceRecord}'
 */
        showForm.get = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::show
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:54
 * @route '/api/v1/attendance/records/{attendanceRecord}'
 */
        showForm.head = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::checkout
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:66
 * @route '/api/v1/attendance/records/{attendanceRecord}/checkout'
 */
export const checkout = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(args, options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/api/v1/attendance/records/{attendanceRecord}/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::checkout
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:66
 * @route '/api/v1/attendance/records/{attendanceRecord}/checkout'
 */
checkout.url = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return checkout.definition.url
            .replace('{attendanceRecord}', parsedArgs.attendanceRecord.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::checkout
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:66
 * @route '/api/v1/attendance/records/{attendanceRecord}/checkout'
 */
checkout.post = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::checkout
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:66
 * @route '/api/v1/attendance/records/{attendanceRecord}/checkout'
 */
    const checkoutForm = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Attendance\Controllers\AttendanceRecordController::checkout
 * @see app/Modules/Attendance/Controllers/AttendanceRecordController.php:66
 * @route '/api/v1/attendance/records/{attendanceRecord}/checkout'
 */
        checkoutForm.post = (args: { attendanceRecord: number | { id: number } } | [attendanceRecord: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(args, options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
const records = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
checkout: Object.assign(checkout, checkout),
}

export default records