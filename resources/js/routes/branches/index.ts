import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/branches',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
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
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/branches/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
 * @see app/Modules/Branch/web.php:11
 * @route '/branches/{branch}'
 */
export const show = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/branches/{branch}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Branch/web.php:11
 * @route '/branches/{branch}'
 */
show.url = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { branch: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { branch: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    branch: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        branch: typeof args.branch === 'object'
                ? args.branch.id
                : args.branch,
                }

    return show.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see app/Modules/Branch/web.php:11
 * @route '/branches/{branch}'
 */
show.get = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
 * @see app/Modules/Branch/web.php:11
 * @route '/branches/{branch}'
 */
show.head = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
 * @see app/Modules/Branch/web.php:11
 * @route '/branches/{branch}'
 */
    const showForm = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
 * @see app/Modules/Branch/web.php:11
 * @route '/branches/{branch}'
 */
        showForm.get = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
 * @see app/Modules/Branch/web.php:11
 * @route '/branches/{branch}'
 */
        showForm.head = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Modules/Branch/web.php:13
 * @route '/branches/{branch}/edit'
 */
export const edit = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/branches/{branch}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Branch/web.php:13
 * @route '/branches/{branch}/edit'
 */
edit.url = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { branch: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { branch: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    branch: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        branch: typeof args.branch === 'object'
                ? args.branch.id
                : args.branch,
                }

    return edit.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see app/Modules/Branch/web.php:13
 * @route '/branches/{branch}/edit'
 */
edit.get = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
 * @see app/Modules/Branch/web.php:13
 * @route '/branches/{branch}/edit'
 */
edit.head = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
 * @see app/Modules/Branch/web.php:13
 * @route '/branches/{branch}/edit'
 */
    const editForm = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
 * @see app/Modules/Branch/web.php:13
 * @route '/branches/{branch}/edit'
 */
        editForm.get = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
 * @see app/Modules/Branch/web.php:13
 * @route '/branches/{branch}/edit'
 */
        editForm.head = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
 * @see app/Modules/Branch/web.php:15
 * @route '/branches/{branch}/opening-hours'
 */
export const openingHours = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openingHours.url(args, options),
    method: 'get',
})

openingHours.definition = {
    methods: ["get","head"],
    url: '/branches/{branch}/opening-hours',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Branch/web.php:15
 * @route '/branches/{branch}/opening-hours'
 */
openingHours.url = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { branch: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { branch: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    branch: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        branch: typeof args.branch === 'object'
                ? args.branch.id
                : args.branch,
                }

    return openingHours.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see app/Modules/Branch/web.php:15
 * @route '/branches/{branch}/opening-hours'
 */
openingHours.get = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openingHours.url(args, options),
    method: 'get',
})
/**
 * @see app/Modules/Branch/web.php:15
 * @route '/branches/{branch}/opening-hours'
 */
openingHours.head = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: openingHours.url(args, options),
    method: 'head',
})

    /**
 * @see app/Modules/Branch/web.php:15
 * @route '/branches/{branch}/opening-hours'
 */
    const openingHoursForm = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: openingHours.url(args, options),
        method: 'get',
    })

            /**
 * @see app/Modules/Branch/web.php:15
 * @route '/branches/{branch}/opening-hours'
 */
        openingHoursForm.get = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openingHours.url(args, options),
            method: 'get',
        })
            /**
 * @see app/Modules/Branch/web.php:15
 * @route '/branches/{branch}/opening-hours'
 */
        openingHoursForm.head = (args: { branch: string | number | { id: string | number } } | [branch: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openingHours.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    openingHours.form = openingHoursForm
const branches = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
openingHours: Object.assign(openingHours, openingHours),
}

export default branches