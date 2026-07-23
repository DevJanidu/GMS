import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Branch\Controllers\BranchController::index
 * @see app/Modules/Branch/Controllers/BranchController.php:17
 * @route '/api/v1/branches'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/branches',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Branch\Controllers\BranchController::index
 * @see app/Modules/Branch/Controllers/BranchController.php:17
 * @route '/api/v1/branches'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Branch\Controllers\BranchController::index
 * @see app/Modules/Branch/Controllers/BranchController.php:17
 * @route '/api/v1/branches'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Branch\Controllers\BranchController::index
 * @see app/Modules/Branch/Controllers/BranchController.php:17
 * @route '/api/v1/branches'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Branch\Controllers\BranchController::index
 * @see app/Modules/Branch/Controllers/BranchController.php:17
 * @route '/api/v1/branches'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Branch\Controllers\BranchController::index
 * @see app/Modules/Branch/Controllers/BranchController.php:17
 * @route '/api/v1/branches'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Branch\Controllers\BranchController::index
 * @see app/Modules/Branch/Controllers/BranchController.php:17
 * @route '/api/v1/branches'
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
* @see \App\Modules\Branch\Controllers\BranchController::store
 * @see app/Modules/Branch/Controllers/BranchController.php:34
 * @route '/api/v1/branches'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/branches',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Branch\Controllers\BranchController::store
 * @see app/Modules/Branch/Controllers/BranchController.php:34
 * @route '/api/v1/branches'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Branch\Controllers\BranchController::store
 * @see app/Modules/Branch/Controllers/BranchController.php:34
 * @route '/api/v1/branches'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Branch\Controllers\BranchController::store
 * @see app/Modules/Branch/Controllers/BranchController.php:34
 * @route '/api/v1/branches'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Branch\Controllers\BranchController::store
 * @see app/Modules/Branch/Controllers/BranchController.php:34
 * @route '/api/v1/branches'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Branch\Controllers\BranchController::show
 * @see app/Modules/Branch/Controllers/BranchController.php:41
 * @route '/api/v1/branches/{branch}'
 */
export const show = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/branches/{branch}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Branch\Controllers\BranchController::show
 * @see app/Modules/Branch/Controllers/BranchController.php:41
 * @route '/api/v1/branches/{branch}'
 */
show.url = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Modules\Branch\Controllers\BranchController::show
 * @see app/Modules/Branch/Controllers/BranchController.php:41
 * @route '/api/v1/branches/{branch}'
 */
show.get = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Branch\Controllers\BranchController::show
 * @see app/Modules/Branch/Controllers/BranchController.php:41
 * @route '/api/v1/branches/{branch}'
 */
show.head = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Branch\Controllers\BranchController::show
 * @see app/Modules/Branch/Controllers/BranchController.php:41
 * @route '/api/v1/branches/{branch}'
 */
    const showForm = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Branch\Controllers\BranchController::show
 * @see app/Modules/Branch/Controllers/BranchController.php:41
 * @route '/api/v1/branches/{branch}'
 */
        showForm.get = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Branch\Controllers\BranchController::show
 * @see app/Modules/Branch/Controllers/BranchController.php:41
 * @route '/api/v1/branches/{branch}'
 */
        showForm.head = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Modules\Branch\Controllers\BranchController::update
 * @see app/Modules/Branch/Controllers/BranchController.php:48
 * @route '/api/v1/branches/{branch}'
 */
export const update = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/branches/{branch}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Modules\Branch\Controllers\BranchController::update
 * @see app/Modules/Branch/Controllers/BranchController.php:48
 * @route '/api/v1/branches/{branch}'
 */
update.url = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Branch\Controllers\BranchController::update
 * @see app/Modules/Branch/Controllers/BranchController.php:48
 * @route '/api/v1/branches/{branch}'
 */
update.put = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Modules\Branch\Controllers\BranchController::update
 * @see app/Modules/Branch/Controllers/BranchController.php:48
 * @route '/api/v1/branches/{branch}'
 */
update.patch = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Branch\Controllers\BranchController::update
 * @see app/Modules/Branch/Controllers/BranchController.php:48
 * @route '/api/v1/branches/{branch}'
 */
    const updateForm = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Branch\Controllers\BranchController::update
 * @see app/Modules/Branch/Controllers/BranchController.php:48
 * @route '/api/v1/branches/{branch}'
 */
        updateForm.put = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Modules\Branch\Controllers\BranchController::update
 * @see app/Modules/Branch/Controllers/BranchController.php:48
 * @route '/api/v1/branches/{branch}'
 */
        updateForm.patch = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\Branch\Controllers\BranchController::destroy
 * @see app/Modules/Branch/Controllers/BranchController.php:55
 * @route '/api/v1/branches/{branch}'
 */
export const destroy = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/branches/{branch}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Modules\Branch\Controllers\BranchController::destroy
 * @see app/Modules/Branch/Controllers/BranchController.php:55
 * @route '/api/v1/branches/{branch}'
 */
destroy.url = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Branch\Controllers\BranchController::destroy
 * @see app/Modules/Branch/Controllers/BranchController.php:55
 * @route '/api/v1/branches/{branch}'
 */
destroy.delete = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Modules\Branch\Controllers\BranchController::destroy
 * @see app/Modules/Branch/Controllers/BranchController.php:55
 * @route '/api/v1/branches/{branch}'
 */
    const destroyForm = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Branch\Controllers\BranchController::destroy
 * @see app/Modules/Branch/Controllers/BranchController.php:55
 * @route '/api/v1/branches/{branch}'
 */
        destroyForm.delete = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\Branch\Controllers\BranchController::updateOpeningHours
 * @see app/Modules/Branch/Controllers/BranchController.php:64
 * @route '/api/v1/branches/{branch}/opening-hours'
 */
export const updateOpeningHours = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateOpeningHours.url(args, options),
    method: 'put',
})

updateOpeningHours.definition = {
    methods: ["put"],
    url: '/api/v1/branches/{branch}/opening-hours',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Modules\Branch\Controllers\BranchController::updateOpeningHours
 * @see app/Modules/Branch/Controllers/BranchController.php:64
 * @route '/api/v1/branches/{branch}/opening-hours'
 */
updateOpeningHours.url = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateOpeningHours.definition.url
            .replace('{branch}', parsedArgs.branch.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Branch\Controllers\BranchController::updateOpeningHours
 * @see app/Modules/Branch/Controllers/BranchController.php:64
 * @route '/api/v1/branches/{branch}/opening-hours'
 */
updateOpeningHours.put = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateOpeningHours.url(args, options),
    method: 'put',
})

    /**
* @see \App\Modules\Branch\Controllers\BranchController::updateOpeningHours
 * @see app/Modules/Branch/Controllers/BranchController.php:64
 * @route '/api/v1/branches/{branch}/opening-hours'
 */
    const updateOpeningHoursForm = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateOpeningHours.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Branch\Controllers\BranchController::updateOpeningHours
 * @see app/Modules/Branch/Controllers/BranchController.php:64
 * @route '/api/v1/branches/{branch}/opening-hours'
 */
        updateOpeningHoursForm.put = (args: { branch: number | { id: number } } | [branch: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateOpeningHours.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateOpeningHours.form = updateOpeningHoursForm
const BranchController = { index, store, show, update, destroy, updateOpeningHours }

export default BranchController