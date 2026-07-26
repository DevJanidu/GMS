import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::show
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:18
 * @route '/api/v1/attendance/members/{member}/qr'
 */
export const show = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/attendance/members/{member}/qr',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::show
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:18
 * @route '/api/v1/attendance/members/{member}/qr'
 */
show.url = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { member: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                }

    return show.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::show
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:18
 * @route '/api/v1/attendance/members/{member}/qr'
 */
show.get = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::show
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:18
 * @route '/api/v1/attendance/members/{member}/qr'
 */
show.head = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::show
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:18
 * @route '/api/v1/attendance/members/{member}/qr'
 */
    const showForm = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::show
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:18
 * @route '/api/v1/attendance/members/{member}/qr'
 */
        showForm.get = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::show
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:18
 * @route '/api/v1/attendance/members/{member}/qr'
 */
        showForm.head = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Modules\Attendance\Controllers\QrCredentialController::rotate
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:29
 * @route '/api/v1/attendance/qr/rotate'
 */
export const rotate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rotate.url(options),
    method: 'post',
})

rotate.definition = {
    methods: ["post"],
    url: '/api/v1/attendance/qr/rotate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::rotate
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:29
 * @route '/api/v1/attendance/qr/rotate'
 */
rotate.url = (options?: RouteQueryOptions) => {
    return rotate.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::rotate
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:29
 * @route '/api/v1/attendance/qr/rotate'
 */
rotate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rotate.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::rotate
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:29
 * @route '/api/v1/attendance/qr/rotate'
 */
    const rotateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rotate.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::rotate
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:29
 * @route '/api/v1/attendance/qr/rotate'
 */
        rotateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rotate.url(options),
            method: 'post',
        })
    
    rotate.form = rotateForm
/**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::revoke
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:43
 * @route '/api/v1/attendance/members/{member}/qr'
 */
export const revoke = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

revoke.definition = {
    methods: ["delete"],
    url: '/api/v1/attendance/members/{member}/qr',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::revoke
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:43
 * @route '/api/v1/attendance/members/{member}/qr'
 */
revoke.url = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { member: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                }

    return revoke.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::revoke
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:43
 * @route '/api/v1/attendance/members/{member}/qr'
 */
revoke.delete = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revoke.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::revoke
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:43
 * @route '/api/v1/attendance/members/{member}/qr'
 */
    const revokeForm = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: revoke.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Attendance\Controllers\QrCredentialController::revoke
 * @see app/Modules/Attendance/Controllers/QrCredentialController.php:43
 * @route '/api/v1/attendance/members/{member}/qr'
 */
        revokeForm.delete = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: revoke.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    revoke.form = revokeForm
const qr = {
    show: Object.assign(show, show),
rotate: Object.assign(rotate, rotate),
revoke: Object.assign(revoke, revoke),
}

export default qr