import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import invitations from './invitations'
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/staff',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
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
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/staff/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
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
 * @see app/Modules/Staff/web.php:11
 * @route '/staff/{staff}'
 */
export const show = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/staff/{staff}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Staff/web.php:11
 * @route '/staff/{staff}'
 */
show.url = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { staff: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { staff: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    staff: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        staff: typeof args.staff === 'object'
                ? args.staff.id
                : args.staff,
                }

    return show.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see app/Modules/Staff/web.php:11
 * @route '/staff/{staff}'
 */
show.get = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
 * @see app/Modules/Staff/web.php:11
 * @route '/staff/{staff}'
 */
show.head = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
 * @see app/Modules/Staff/web.php:11
 * @route '/staff/{staff}'
 */
    const showForm = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
 * @see app/Modules/Staff/web.php:11
 * @route '/staff/{staff}'
 */
        showForm.get = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
 * @see app/Modules/Staff/web.php:11
 * @route '/staff/{staff}'
 */
        showForm.head = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Modules/Staff/web.php:13
 * @route '/staff/{staff}/edit'
 */
export const edit = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/staff/{staff}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Staff/web.php:13
 * @route '/staff/{staff}/edit'
 */
edit.url = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { staff: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { staff: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    staff: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        staff: typeof args.staff === 'object'
                ? args.staff.id
                : args.staff,
                }

    return edit.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see app/Modules/Staff/web.php:13
 * @route '/staff/{staff}/edit'
 */
edit.get = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
 * @see app/Modules/Staff/web.php:13
 * @route '/staff/{staff}/edit'
 */
edit.head = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
 * @see app/Modules/Staff/web.php:13
 * @route '/staff/{staff}/edit'
 */
    const editForm = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
 * @see app/Modules/Staff/web.php:13
 * @route '/staff/{staff}/edit'
 */
        editForm.get = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
 * @see app/Modules/Staff/web.php:13
 * @route '/staff/{staff}/edit'
 */
        editForm.head = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Modules/Staff/web.php:15
 * @route '/staff/{staff}/branches'
 */
export const branches = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: branches.url(args, options),
    method: 'get',
})

branches.definition = {
    methods: ["get","head"],
    url: '/staff/{staff}/branches',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Staff/web.php:15
 * @route '/staff/{staff}/branches'
 */
branches.url = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { staff: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { staff: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    staff: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        staff: typeof args.staff === 'object'
                ? args.staff.id
                : args.staff,
                }

    return branches.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see app/Modules/Staff/web.php:15
 * @route '/staff/{staff}/branches'
 */
branches.get = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: branches.url(args, options),
    method: 'get',
})
/**
 * @see app/Modules/Staff/web.php:15
 * @route '/staff/{staff}/branches'
 */
branches.head = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: branches.url(args, options),
    method: 'head',
})

    /**
 * @see app/Modules/Staff/web.php:15
 * @route '/staff/{staff}/branches'
 */
    const branchesForm = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: branches.url(args, options),
        method: 'get',
    })

            /**
 * @see app/Modules/Staff/web.php:15
 * @route '/staff/{staff}/branches'
 */
        branchesForm.get = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: branches.url(args, options),
            method: 'get',
        })
            /**
 * @see app/Modules/Staff/web.php:15
 * @route '/staff/{staff}/branches'
 */
        branchesForm.head = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: branches.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    branches.form = branchesForm
const staff = {
    invitations: Object.assign(invitations, invitations),
index: Object.assign(index, index),
create: Object.assign(create, create),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
branches: Object.assign(branches, branches),
}

export default staff