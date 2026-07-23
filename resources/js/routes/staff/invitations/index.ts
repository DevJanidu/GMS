import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::show
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:14
 * @route '/api/v1/staff/invitations/{user}'
 */
export const show = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/staff/invitations/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::show
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:14
 * @route '/api/v1/staff/invitations/{user}'
 */
show.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::show
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:14
 * @route '/api/v1/staff/invitations/{user}'
 */
show.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::show
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:14
 * @route '/api/v1/staff/invitations/{user}'
 */
show.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::show
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:14
 * @route '/api/v1/staff/invitations/{user}'
 */
    const showForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::show
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:14
 * @route '/api/v1/staff/invitations/{user}'
 */
        showForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::show
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:14
 * @route '/api/v1/staff/invitations/{user}'
 */
        showForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Modules\Staff\Controllers\StaffInvitationController::accept
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:24
 * @route '/api/v1/staff/invitations/{user}/accept'
 */
export const accept = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/api/v1/staff/invitations/{user}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::accept
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:24
 * @route '/api/v1/staff/invitations/{user}/accept'
 */
accept.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return accept.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::accept
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:24
 * @route '/api/v1/staff/invitations/{user}/accept'
 */
accept.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::accept
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:24
 * @route '/api/v1/staff/invitations/{user}/accept'
 */
    const acceptForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: accept.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Staff\Controllers\StaffInvitationController::accept
 * @see app/Modules/Staff/Controllers/StaffInvitationController.php:24
 * @route '/api/v1/staff/invitations/{user}/accept'
 */
        acceptForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: accept.url(args, options),
            method: 'post',
        })
    
    accept.form = acceptForm
const invitations = {
    show: Object.assign(show, show),
accept: Object.assign(accept, accept),
}

export default invitations