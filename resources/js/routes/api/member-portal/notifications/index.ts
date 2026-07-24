import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::read
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/read'
 */
export const read = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: read.url(args, options),
    method: 'patch',
})

read.definition = {
    methods: ["patch"],
    url: '/api/v1/member-portal/notifications/{notification}/read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::read
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/read'
 */
read.url = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: args.notification,
                }

    return read.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::read
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/read'
 */
read.patch = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: read.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::read
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/read'
 */
    const readForm = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: read.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::read
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/read'
 */
        readForm.patch = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: read.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    read.form = readForm
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::unread
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/unread'
 */
export const unread = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: unread.url(args, options),
    method: 'patch',
})

unread.definition = {
    methods: ["patch"],
    url: '/api/v1/member-portal/notifications/{notification}/unread',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::unread
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/unread'
 */
unread.url = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: args.notification,
                }

    return unread.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::unread
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/unread'
 */
unread.patch = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: unread.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::unread
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/unread'
 */
    const unreadForm = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: unread.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::unread
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/unread'
 */
        unreadForm.patch = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: unread.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    unread.form = unreadForm
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markAllRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/mark-all-read'
 */
export const markAllRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllRead.url(options),
    method: 'post',
})

markAllRead.definition = {
    methods: ["post"],
    url: '/api/v1/member-portal/notifications/mark-all-read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markAllRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/mark-all-read'
 */
markAllRead.url = (options?: RouteQueryOptions) => {
    return markAllRead.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markAllRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/mark-all-read'
 */
markAllRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllRead.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markAllRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/mark-all-read'
 */
    const markAllReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAllRead.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markAllRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/mark-all-read'
 */
        markAllReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAllRead.url(options),
            method: 'post',
        })
    
    markAllRead.form = markAllReadForm
const notifications = {
    read: Object.assign(read, read),
unread: Object.assign(unread, unread),
markAllRead: Object.assign(markAllRead, markAllRead),
}

export default notifications