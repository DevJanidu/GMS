import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\AccessControl\Controllers\RoleController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:20
 * @route '/api/v1/roles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\AccessControl\Controllers\RoleController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:20
 * @route '/api/v1/roles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\AccessControl\Controllers\RoleController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:20
 * @route '/api/v1/roles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\AccessControl\Controllers\RoleController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:20
 * @route '/api/v1/roles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\AccessControl\Controllers\RoleController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:20
 * @route '/api/v1/roles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\AccessControl\Controllers\RoleController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:20
 * @route '/api/v1/roles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\AccessControl\Controllers\RoleController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:20
 * @route '/api/v1/roles'
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
* @see \App\Modules\AccessControl\Controllers\RoleController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:33
 * @route '/api/v1/roles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\AccessControl\Controllers\RoleController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:33
 * @route '/api/v1/roles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\AccessControl\Controllers\RoleController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:33
 * @route '/api/v1/roles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\AccessControl\Controllers\RoleController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:33
 * @route '/api/v1/roles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\AccessControl\Controllers\RoleController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:33
 * @route '/api/v1/roles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\AccessControl\Controllers\RoleController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:55
 * @route '/api/v1/roles/{role}'
 */
export const show = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/roles/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\AccessControl\Controllers\RoleController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:55
 * @route '/api/v1/roles/{role}'
 */
show.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return show.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\AccessControl\Controllers\RoleController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:55
 * @route '/api/v1/roles/{role}'
 */
show.get = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\AccessControl\Controllers\RoleController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:55
 * @route '/api/v1/roles/{role}'
 */
show.head = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\AccessControl\Controllers\RoleController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:55
 * @route '/api/v1/roles/{role}'
 */
    const showForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\AccessControl\Controllers\RoleController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:55
 * @route '/api/v1/roles/{role}'
 */
        showForm.get = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\AccessControl\Controllers\RoleController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:55
 * @route '/api/v1/roles/{role}'
 */
        showForm.head = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Modules\AccessControl\Controllers\RoleController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:64
 * @route '/api/v1/roles/{role}'
 */
export const update = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/roles/{role}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Modules\AccessControl\Controllers\RoleController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:64
 * @route '/api/v1/roles/{role}'
 */
update.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return update.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\AccessControl\Controllers\RoleController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:64
 * @route '/api/v1/roles/{role}'
 */
update.put = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Modules\AccessControl\Controllers\RoleController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:64
 * @route '/api/v1/roles/{role}'
 */
update.patch = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\AccessControl\Controllers\RoleController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:64
 * @route '/api/v1/roles/{role}'
 */
    const updateForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\AccessControl\Controllers\RoleController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:64
 * @route '/api/v1/roles/{role}'
 */
        updateForm.put = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Modules\AccessControl\Controllers\RoleController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:64
 * @route '/api/v1/roles/{role}'
 */
        updateForm.patch = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\AccessControl\Controllers\RoleController::destroy
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:85
 * @route '/api/v1/roles/{role}'
 */
export const destroy = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Modules\AccessControl\Controllers\RoleController::destroy
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:85
 * @route '/api/v1/roles/{role}'
 */
destroy.url = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return destroy.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\AccessControl\Controllers\RoleController::destroy
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:85
 * @route '/api/v1/roles/{role}'
 */
destroy.delete = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Modules\AccessControl\Controllers\RoleController::destroy
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:85
 * @route '/api/v1/roles/{role}'
 */
    const destroyForm = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\AccessControl\Controllers\RoleController::destroy
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/AccessControl/Controllers/RoleController.php:85
 * @route '/api/v1/roles/{role}'
 */
        destroyForm.delete = (args: { role: string | number | { id: string | number } } | [role: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const RoleController = { index, store, show, update, destroy }

export default RoleController