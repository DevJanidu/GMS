import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::index
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:15
 * @route '/api/v1/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::index
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:15
 * @route '/api/v1/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::index
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:15
 * @route '/api/v1/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::index
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:15
 * @route '/api/v1/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::index
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:15
 * @route '/api/v1/notifications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::index
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:15
 * @route '/api/v1/notifications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::index
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:15
 * @route '/api/v1/notifications'
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
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unreadCount
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:24
 * @route '/api/v1/notifications/unread-count'
 */
export const unreadCount = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})

unreadCount.definition = {
    methods: ["get","head"],
    url: '/api/v1/notifications/unread-count',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unreadCount
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:24
 * @route '/api/v1/notifications/unread-count'
 */
unreadCount.url = (options?: RouteQueryOptions) => {
    return unreadCount.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unreadCount
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:24
 * @route '/api/v1/notifications/unread-count'
 */
unreadCount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unreadCount
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:24
 * @route '/api/v1/notifications/unread-count'
 */
unreadCount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unreadCount.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unreadCount
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:24
 * @route '/api/v1/notifications/unread-count'
 */
    const unreadCountForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: unreadCount.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unreadCount
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:24
 * @route '/api/v1/notifications/unread-count'
 */
        unreadCountForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unreadCount.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unreadCount
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:24
 * @route '/api/v1/notifications/unread-count'
 */
        unreadCountForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unreadCount.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    unreadCount.form = unreadCountForm
/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::read
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:29
 * @route '/api/v1/notifications/{notification}/read'
 */
export const read = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: read.url(args, options),
    method: 'patch',
})

read.definition = {
    methods: ["patch"],
    url: '/api/v1/notifications/{notification}/read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::read
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:29
 * @route '/api/v1/notifications/{notification}/read'
 */
read.url = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return read.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::read
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:29
 * @route '/api/v1/notifications/{notification}/read'
 */
read.patch = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: read.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::read
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:29
 * @route '/api/v1/notifications/{notification}/read'
 */
    const readForm = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: read.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::read
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:29
 * @route '/api/v1/notifications/{notification}/read'
 */
        readForm.patch = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unread
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:37
 * @route '/api/v1/notifications/{notification}/unread'
 */
export const unread = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: unread.url(args, options),
    method: 'patch',
})

unread.definition = {
    methods: ["patch"],
    url: '/api/v1/notifications/{notification}/unread',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unread
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:37
 * @route '/api/v1/notifications/{notification}/unread'
 */
unread.url = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return unread.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unread
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:37
 * @route '/api/v1/notifications/{notification}/unread'
 */
unread.patch = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: unread.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unread
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:37
 * @route '/api/v1/notifications/{notification}/unread'
 */
    const unreadForm = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: unread.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::unread
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:37
 * @route '/api/v1/notifications/{notification}/unread'
 */
        unreadForm.patch = (args: { notification: string | number | { id: string | number } } | [notification: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\Notification\Controllers\NotificationCenterController::markAllRead
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:45
 * @route '/api/v1/notifications/mark-all-read'
 */
export const markAllRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllRead.url(options),
    method: 'post',
})

markAllRead.definition = {
    methods: ["post"],
    url: '/api/v1/notifications/mark-all-read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::markAllRead
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:45
 * @route '/api/v1/notifications/mark-all-read'
 */
markAllRead.url = (options?: RouteQueryOptions) => {
    return markAllRead.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::markAllRead
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:45
 * @route '/api/v1/notifications/mark-all-read'
 */
markAllRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllRead.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::markAllRead
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:45
 * @route '/api/v1/notifications/mark-all-read'
 */
    const markAllReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAllRead.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationCenterController::markAllRead
 * @see app/Modules/Notification/Controllers/NotificationCenterController.php:45
 * @route '/api/v1/notifications/mark-all-read'
 */
        markAllReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAllRead.url(options),
            method: 'post',
        })
    
    markAllRead.form = markAllReadForm
const notifications = {
    index: Object.assign(index, index),
unreadCount: Object.assign(unreadCount, unreadCount),
read: Object.assign(read, read),
unread: Object.assign(unread, unread),
markAllRead: Object.assign(markAllRead, markAllRead),
}

export default notifications