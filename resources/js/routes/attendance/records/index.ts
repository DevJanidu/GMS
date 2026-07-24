import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
 * @see app/Modules/Attendance/web.php:18
 * @route '/attendance/records/{attendanceRecordId}'
 */
export const show = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/attendance/records/{attendanceRecordId}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Attendance/web.php:18
 * @route '/attendance/records/{attendanceRecordId}'
 */
show.url = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendanceRecordId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    attendanceRecordId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendanceRecordId: args.attendanceRecordId,
                }

    return show.definition.url
            .replace('{attendanceRecordId}', parsedArgs.attendanceRecordId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see app/Modules/Attendance/web.php:18
 * @route '/attendance/records/{attendanceRecordId}'
 */
show.get = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
 * @see app/Modules/Attendance/web.php:18
 * @route '/attendance/records/{attendanceRecordId}'
 */
show.head = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
 * @see app/Modules/Attendance/web.php:18
 * @route '/attendance/records/{attendanceRecordId}'
 */
    const showForm = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
 * @see app/Modules/Attendance/web.php:18
 * @route '/attendance/records/{attendanceRecordId}'
 */
        showForm.get = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
 * @see app/Modules/Attendance/web.php:18
 * @route '/attendance/records/{attendanceRecordId}'
 */
        showForm.head = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const records = {
    show: Object.assign(show, show),
}

export default records