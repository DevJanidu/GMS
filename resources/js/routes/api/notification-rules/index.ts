import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::index
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:18
 * @route '/api/v1/notification-rules'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/notification-rules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::index
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:18
 * @route '/api/v1/notification-rules'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::index
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:18
 * @route '/api/v1/notification-rules'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::index
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:18
 * @route '/api/v1/notification-rules'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::index
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:18
 * @route '/api/v1/notification-rules'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::index
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:18
 * @route '/api/v1/notification-rules'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::index
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:18
 * @route '/api/v1/notification-rules'
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
* @see \App\Modules\Notification\Controllers\NotificationRuleController::store
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:30
 * @route '/api/v1/notification-rules'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/notification-rules',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::store
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:30
 * @route '/api/v1/notification-rules'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::store
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:30
 * @route '/api/v1/notification-rules'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::store
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:30
 * @route '/api/v1/notification-rules'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::store
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:30
 * @route '/api/v1/notification-rules'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::show
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:41
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
export const show = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/notification-rules/{notification_rule}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::show
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:41
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
show.url = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification_rule: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification_rule: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification_rule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification_rule: typeof args.notification_rule === 'object'
                ? args.notification_rule.id
                : args.notification_rule,
                }

    return show.definition.url
            .replace('{notification_rule}', parsedArgs.notification_rule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::show
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:41
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
show.get = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::show
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:41
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
show.head = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::show
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:41
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
    const showForm = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::show
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:41
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
        showForm.get = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::show
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:41
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
        showForm.head = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Modules\Notification\Controllers\NotificationRuleController::update
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:48
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
export const update = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/notification-rules/{notification_rule}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::update
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:48
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
update.url = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification_rule: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification_rule: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification_rule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification_rule: typeof args.notification_rule === 'object'
                ? args.notification_rule.id
                : args.notification_rule,
                }

    return update.definition.url
            .replace('{notification_rule}', parsedArgs.notification_rule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::update
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:48
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
update.put = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::update
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:48
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
update.patch = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::update
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:48
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
    const updateForm = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::update
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:48
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
        updateForm.put = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::update
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:48
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
        updateForm.patch = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::destroy
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:61
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
export const destroy = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/notification-rules/{notification_rule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::destroy
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:61
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
destroy.url = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification_rule: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification_rule: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification_rule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification_rule: typeof args.notification_rule === 'object'
                ? args.notification_rule.id
                : args.notification_rule,
                }

    return destroy.definition.url
            .replace('{notification_rule}', parsedArgs.notification_rule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::destroy
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:61
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
destroy.delete = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::destroy
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:61
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
    const destroyForm = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationRuleController::destroy
 * @see app/Modules/Notification/Controllers/NotificationRuleController.php:61
 * @route '/api/v1/notification-rules/{notification_rule}'
 */
        destroyForm.delete = (args: { notification_rule: number | { id: number } } | [notification_rule: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const notificationRules = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default notificationRules