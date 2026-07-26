import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
 * @see app/Modules/Attendance/web.php:22
 * @route '/attendance/records/{attendanceRecordId}/correct'
 */
export const create = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/attendance/records/{attendanceRecordId}/correct',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Attendance/web.php:22
 * @route '/attendance/records/{attendanceRecordId}/correct'
 */
create.url = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{attendanceRecordId}', parsedArgs.attendanceRecordId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see app/Modules/Attendance/web.php:22
 * @route '/attendance/records/{attendanceRecordId}/correct'
 */
create.get = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
 * @see app/Modules/Attendance/web.php:22
 * @route '/attendance/records/{attendanceRecordId}/correct'
 */
create.head = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
 * @see app/Modules/Attendance/web.php:22
 * @route '/attendance/records/{attendanceRecordId}/correct'
 */
    const createForm = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
 * @see app/Modules/Attendance/web.php:22
 * @route '/attendance/records/{attendanceRecordId}/correct'
 */
        createForm.get = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
 * @see app/Modules/Attendance/web.php:22
 * @route '/attendance/records/{attendanceRecordId}/correct'
 */
        createForm.head = (args: { attendanceRecordId: string | number } | [attendanceRecordId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
const corrections = {
    create: Object.assign(create, create),
}

export default corrections