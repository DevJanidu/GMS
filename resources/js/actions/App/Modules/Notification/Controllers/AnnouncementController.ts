import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::index
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:20
 * @route '/api/v1/announcements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/announcements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::index
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:20
 * @route '/api/v1/announcements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::index
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:20
 * @route '/api/v1/announcements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::index
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:20
 * @route '/api/v1/announcements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::index
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:20
 * @route '/api/v1/announcements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::index
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:20
 * @route '/api/v1/announcements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::index
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:20
 * @route '/api/v1/announcements'
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
* @see \App\Modules\Notification\Controllers\AnnouncementController::store
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:31
 * @route '/api/v1/announcements'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/announcements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::store
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:31
 * @route '/api/v1/announcements'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::store
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:31
 * @route '/api/v1/announcements'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::store
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:31
 * @route '/api/v1/announcements'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::store
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:31
 * @route '/api/v1/announcements'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::show
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:43
 * @route '/api/v1/announcements/{announcement}'
 */
export const show = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/announcements/{announcement}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::show
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:43
 * @route '/api/v1/announcements/{announcement}'
 */
show.url = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { announcement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { announcement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    announcement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        announcement: typeof args.announcement === 'object'
                ? args.announcement.id
                : args.announcement,
                }

    return show.definition.url
            .replace('{announcement}', parsedArgs.announcement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::show
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:43
 * @route '/api/v1/announcements/{announcement}'
 */
show.get = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::show
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:43
 * @route '/api/v1/announcements/{announcement}'
 */
show.head = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::show
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:43
 * @route '/api/v1/announcements/{announcement}'
 */
    const showForm = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::show
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:43
 * @route '/api/v1/announcements/{announcement}'
 */
        showForm.get = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::show
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:43
 * @route '/api/v1/announcements/{announcement}'
 */
        showForm.head = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Modules\Notification\Controllers\AnnouncementController::update
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:50
 * @route '/api/v1/announcements/{announcement}'
 */
export const update = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/announcements/{announcement}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::update
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:50
 * @route '/api/v1/announcements/{announcement}'
 */
update.url = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { announcement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { announcement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    announcement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        announcement: typeof args.announcement === 'object'
                ? args.announcement.id
                : args.announcement,
                }

    return update.definition.url
            .replace('{announcement}', parsedArgs.announcement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::update
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:50
 * @route '/api/v1/announcements/{announcement}'
 */
update.put = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::update
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:50
 * @route '/api/v1/announcements/{announcement}'
 */
update.patch = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::update
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:50
 * @route '/api/v1/announcements/{announcement}'
 */
    const updateForm = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::update
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:50
 * @route '/api/v1/announcements/{announcement}'
 */
        updateForm.put = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::update
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:50
 * @route '/api/v1/announcements/{announcement}'
 */
        updateForm.patch = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\Notification\Controllers\AnnouncementController::destroy
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:65
 * @route '/api/v1/announcements/{announcement}'
 */
export const destroy = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/announcements/{announcement}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::destroy
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:65
 * @route '/api/v1/announcements/{announcement}'
 */
destroy.url = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { announcement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { announcement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    announcement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        announcement: typeof args.announcement === 'object'
                ? args.announcement.id
                : args.announcement,
                }

    return destroy.definition.url
            .replace('{announcement}', parsedArgs.announcement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::destroy
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:65
 * @route '/api/v1/announcements/{announcement}'
 */
destroy.delete = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::destroy
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:65
 * @route '/api/v1/announcements/{announcement}'
 */
    const destroyForm = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::destroy
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:65
 * @route '/api/v1/announcements/{announcement}'
 */
        destroyForm.delete = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\Notification\Controllers\AnnouncementController::schedule
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:75
 * @route '/api/v1/announcements/{announcement}/schedule'
 */
export const schedule = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: schedule.url(args, options),
    method: 'post',
})

schedule.definition = {
    methods: ["post"],
    url: '/api/v1/announcements/{announcement}/schedule',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::schedule
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:75
 * @route '/api/v1/announcements/{announcement}/schedule'
 */
schedule.url = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { announcement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { announcement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    announcement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        announcement: typeof args.announcement === 'object'
                ? args.announcement.id
                : args.announcement,
                }

    return schedule.definition.url
            .replace('{announcement}', parsedArgs.announcement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::schedule
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:75
 * @route '/api/v1/announcements/{announcement}/schedule'
 */
schedule.post = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: schedule.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::schedule
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:75
 * @route '/api/v1/announcements/{announcement}/schedule'
 */
    const scheduleForm = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: schedule.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::schedule
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:75
 * @route '/api/v1/announcements/{announcement}/schedule'
 */
        scheduleForm.post = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: schedule.url(args, options),
            method: 'post',
        })
    
    schedule.form = scheduleForm
/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::cancel
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:91
 * @route '/api/v1/announcements/{announcement}/cancel'
 */
export const cancel = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/api/v1/announcements/{announcement}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::cancel
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:91
 * @route '/api/v1/announcements/{announcement}/cancel'
 */
cancel.url = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { announcement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { announcement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    announcement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        announcement: typeof args.announcement === 'object'
                ? args.announcement.id
                : args.announcement,
                }

    return cancel.definition.url
            .replace('{announcement}', parsedArgs.announcement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\AnnouncementController::cancel
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:91
 * @route '/api/v1/announcements/{announcement}/cancel'
 */
cancel.post = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::cancel
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:91
 * @route '/api/v1/announcements/{announcement}/cancel'
 */
    const cancelForm = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\AnnouncementController::cancel
 * @see app/Modules/Notification/Controllers/AnnouncementController.php:91
 * @route '/api/v1/announcements/{announcement}/cancel'
 */
        cancelForm.post = (args: { announcement: number | { id: number } } | [announcement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
const AnnouncementController = { index, store, show, update, destroy, schedule, cancel }

export default AnnouncementController