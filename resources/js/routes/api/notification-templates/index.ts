import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::index
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:17
 * @route '/api/v1/notification-templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/notification-templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::index
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:17
 * @route '/api/v1/notification-templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::index
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:17
 * @route '/api/v1/notification-templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::index
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:17
 * @route '/api/v1/notification-templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::index
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:17
 * @route '/api/v1/notification-templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::index
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:17
 * @route '/api/v1/notification-templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::index
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:17
 * @route '/api/v1/notification-templates'
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
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::store
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:29
 * @route '/api/v1/notification-templates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/notification-templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::store
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:29
 * @route '/api/v1/notification-templates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::store
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:29
 * @route '/api/v1/notification-templates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::store
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:29
 * @route '/api/v1/notification-templates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::store
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:29
 * @route '/api/v1/notification-templates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::show
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:42
 * @route '/api/v1/notification-templates/{notification_template}'
 */
export const show = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/notification-templates/{notification_template}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::show
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:42
 * @route '/api/v1/notification-templates/{notification_template}'
 */
show.url = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification_template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification_template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification_template: typeof args.notification_template === 'object'
                ? args.notification_template.id
                : args.notification_template,
                }

    return show.definition.url
            .replace('{notification_template}', parsedArgs.notification_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::show
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:42
 * @route '/api/v1/notification-templates/{notification_template}'
 */
show.get = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::show
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:42
 * @route '/api/v1/notification-templates/{notification_template}'
 */
show.head = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::show
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:42
 * @route '/api/v1/notification-templates/{notification_template}'
 */
    const showForm = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::show
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:42
 * @route '/api/v1/notification-templates/{notification_template}'
 */
        showForm.get = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::show
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:42
 * @route '/api/v1/notification-templates/{notification_template}'
 */
        showForm.head = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::update
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:49
 * @route '/api/v1/notification-templates/{notification_template}'
 */
export const update = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/notification-templates/{notification_template}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::update
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:49
 * @route '/api/v1/notification-templates/{notification_template}'
 */
update.url = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification_template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification_template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification_template: typeof args.notification_template === 'object'
                ? args.notification_template.id
                : args.notification_template,
                }

    return update.definition.url
            .replace('{notification_template}', parsedArgs.notification_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::update
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:49
 * @route '/api/v1/notification-templates/{notification_template}'
 */
update.put = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::update
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:49
 * @route '/api/v1/notification-templates/{notification_template}'
 */
update.patch = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::update
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:49
 * @route '/api/v1/notification-templates/{notification_template}'
 */
    const updateForm = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::update
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:49
 * @route '/api/v1/notification-templates/{notification_template}'
 */
        updateForm.put = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::update
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:49
 * @route '/api/v1/notification-templates/{notification_template}'
 */
        updateForm.patch = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::destroy
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:64
 * @route '/api/v1/notification-templates/{notification_template}'
 */
export const destroy = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/notification-templates/{notification_template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::destroy
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:64
 * @route '/api/v1/notification-templates/{notification_template}'
 */
destroy.url = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification_template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification_template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification_template: typeof args.notification_template === 'object'
                ? args.notification_template.id
                : args.notification_template,
                }

    return destroy.definition.url
            .replace('{notification_template}', parsedArgs.notification_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::destroy
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:64
 * @route '/api/v1/notification-templates/{notification_template}'
 */
destroy.delete = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::destroy
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:64
 * @route '/api/v1/notification-templates/{notification_template}'
 */
    const destroyForm = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::destroy
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:64
 * @route '/api/v1/notification-templates/{notification_template}'
 */
        destroyForm.delete = (args: { notification_template: number | { id: number } } | [notification_template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::preview
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:73
 * @route '/api/v1/notification-templates/{notificationTemplate}/preview'
 */
export const preview = (args: { notificationTemplate: number | { id: number } } | [notificationTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(args, options),
    method: 'post',
})

preview.definition = {
    methods: ["post"],
    url: '/api/v1/notification-templates/{notificationTemplate}/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::preview
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:73
 * @route '/api/v1/notification-templates/{notificationTemplate}/preview'
 */
preview.url = (args: { notificationTemplate: number | { id: number } } | [notificationTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notificationTemplate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notificationTemplate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notificationTemplate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notificationTemplate: typeof args.notificationTemplate === 'object'
                ? args.notificationTemplate.id
                : args.notificationTemplate,
                }

    return preview.definition.url
            .replace('{notificationTemplate}', parsedArgs.notificationTemplate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::preview
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:73
 * @route '/api/v1/notification-templates/{notificationTemplate}/preview'
 */
preview.post = (args: { notificationTemplate: number | { id: number } } | [notificationTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::preview
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:73
 * @route '/api/v1/notification-templates/{notificationTemplate}/preview'
 */
    const previewForm = (args: { notificationTemplate: number | { id: number } } | [notificationTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: preview.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationTemplateController::preview
 * @see app/Modules/Notification/Controllers/NotificationTemplateController.php:73
 * @route '/api/v1/notification-templates/{notificationTemplate}/preview'
 */
        previewForm.post = (args: { notificationTemplate: number | { id: number } } | [notificationTemplate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: preview.url(args, options),
            method: 'post',
        })
    
    preview.form = previewForm
const notificationTemplates = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
preview: Object.assign(preview, preview),
}

export default notificationTemplates