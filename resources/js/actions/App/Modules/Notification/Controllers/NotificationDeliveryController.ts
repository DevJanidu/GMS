import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::index
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:16
 * @route '/api/v1/notification-deliveries'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/notification-deliveries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::index
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:16
 * @route '/api/v1/notification-deliveries'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::index
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:16
 * @route '/api/v1/notification-deliveries'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::index
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:16
 * @route '/api/v1/notification-deliveries'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::index
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:16
 * @route '/api/v1/notification-deliveries'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::index
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:16
 * @route '/api/v1/notification-deliveries'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::index
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:16
 * @route '/api/v1/notification-deliveries'
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
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::show
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:30
 * @route '/api/v1/notification-deliveries/{notificationDelivery}'
 */
export const show = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/notification-deliveries/{notificationDelivery}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::show
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:30
 * @route '/api/v1/notification-deliveries/{notificationDelivery}'
 */
show.url = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificationDelivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notificationDelivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notificationDelivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificationDelivery: typeof args.notificationDelivery === 'object'
                ? args.notificationDelivery.id
                : args.notificationDelivery,
                }

    return show.definition.url
            .replace('{notificationDelivery}', parsedArgs.notificationDelivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::show
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:30
 * @route '/api/v1/notification-deliveries/{notificationDelivery}'
 */
show.get = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::show
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:30
 * @route '/api/v1/notification-deliveries/{notificationDelivery}'
 */
show.head = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::show
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:30
 * @route '/api/v1/notification-deliveries/{notificationDelivery}'
 */
    const showForm = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::show
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:30
 * @route '/api/v1/notification-deliveries/{notificationDelivery}'
 */
        showForm.get = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::show
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:30
 * @route '/api/v1/notification-deliveries/{notificationDelivery}'
 */
        showForm.head = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::retry
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:37
 * @route '/api/v1/notification-deliveries/{notificationDelivery}/retry'
 */
export const retry = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/api/v1/notification-deliveries/{notificationDelivery}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::retry
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:37
 * @route '/api/v1/notification-deliveries/{notificationDelivery}/retry'
 */
retry.url = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificationDelivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notificationDelivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notificationDelivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificationDelivery: typeof args.notificationDelivery === 'object'
                ? args.notificationDelivery.id
                : args.notificationDelivery,
                }

    return retry.definition.url
            .replace('{notificationDelivery}', parsedArgs.notificationDelivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::retry
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:37
 * @route '/api/v1/notification-deliveries/{notificationDelivery}/retry'
 */
retry.post = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::retry
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:37
 * @route '/api/v1/notification-deliveries/{notificationDelivery}/retry'
 */
    const retryForm = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retry.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationDeliveryController::retry
 * @see app/Modules/Notification/Controllers/NotificationDeliveryController.php:37
 * @route '/api/v1/notification-deliveries/{notificationDelivery}/retry'
 */
        retryForm.post = (args: { notificationDelivery: number | { id: number } } | [notificationDelivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retry.url(args, options),
            method: 'post',
        })
    
    retry.form = retryForm
const NotificationDeliveryController = { index, show, retry }

export default NotificationDeliveryController