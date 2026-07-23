import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Staff\Controllers\StaffController::index
 * @see app/Modules/Staff/Controllers/StaffController.php:24
 * @route '/api/v1/staff'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/staff',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Staff\Controllers\StaffController::index
 * @see app/Modules/Staff/Controllers/StaffController.php:24
 * @route '/api/v1/staff'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Staff\Controllers\StaffController::index
 * @see app/Modules/Staff/Controllers/StaffController.php:24
 * @route '/api/v1/staff'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Staff\Controllers\StaffController::index
 * @see app/Modules/Staff/Controllers/StaffController.php:24
 * @route '/api/v1/staff'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Staff\Controllers\StaffController::index
 * @see app/Modules/Staff/Controllers/StaffController.php:24
 * @route '/api/v1/staff'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Staff\Controllers\StaffController::index
 * @see app/Modules/Staff/Controllers/StaffController.php:24
 * @route '/api/v1/staff'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Staff\Controllers\StaffController::index
 * @see app/Modules/Staff/Controllers/StaffController.php:24
 * @route '/api/v1/staff'
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
* @see \App\Modules\Staff\Controllers\StaffController::store
 * @see app/Modules/Staff/Controllers/StaffController.php:45
 * @route '/api/v1/staff'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/staff',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Staff\Controllers\StaffController::store
 * @see app/Modules/Staff/Controllers/StaffController.php:45
 * @route '/api/v1/staff'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Staff\Controllers\StaffController::store
 * @see app/Modules/Staff/Controllers/StaffController.php:45
 * @route '/api/v1/staff'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Staff\Controllers\StaffController::store
 * @see app/Modules/Staff/Controllers/StaffController.php:45
 * @route '/api/v1/staff'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Staff\Controllers\StaffController::store
 * @see app/Modules/Staff/Controllers/StaffController.php:45
 * @route '/api/v1/staff'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Staff\Controllers\StaffController::show
 * @see app/Modules/Staff/Controllers/StaffController.php:91
 * @route '/api/v1/staff/{staff}'
 */
export const show = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/staff/{staff}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Staff\Controllers\StaffController::show
 * @see app/Modules/Staff/Controllers/StaffController.php:91
 * @route '/api/v1/staff/{staff}'
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
* @see \App\Modules\Staff\Controllers\StaffController::show
 * @see app/Modules/Staff/Controllers/StaffController.php:91
 * @route '/api/v1/staff/{staff}'
 */
show.get = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Staff\Controllers\StaffController::show
 * @see app/Modules/Staff/Controllers/StaffController.php:91
 * @route '/api/v1/staff/{staff}'
 */
show.head = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Staff\Controllers\StaffController::show
 * @see app/Modules/Staff/Controllers/StaffController.php:91
 * @route '/api/v1/staff/{staff}'
 */
    const showForm = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Staff\Controllers\StaffController::show
 * @see app/Modules/Staff/Controllers/StaffController.php:91
 * @route '/api/v1/staff/{staff}'
 */
        showForm.get = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Staff\Controllers\StaffController::show
 * @see app/Modules/Staff/Controllers/StaffController.php:91
 * @route '/api/v1/staff/{staff}'
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
* @see \App\Modules\Staff\Controllers\StaffController::update
 * @see app/Modules/Staff/Controllers/StaffController.php:100
 * @route '/api/v1/staff/{staff}'
 */
export const update = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/staff/{staff}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Modules\Staff\Controllers\StaffController::update
 * @see app/Modules/Staff/Controllers/StaffController.php:100
 * @route '/api/v1/staff/{staff}'
 */
update.url = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Staff\Controllers\StaffController::update
 * @see app/Modules/Staff/Controllers/StaffController.php:100
 * @route '/api/v1/staff/{staff}'
 */
update.put = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Modules\Staff\Controllers\StaffController::update
 * @see app/Modules/Staff/Controllers/StaffController.php:100
 * @route '/api/v1/staff/{staff}'
 */
update.patch = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Staff\Controllers\StaffController::update
 * @see app/Modules/Staff/Controllers/StaffController.php:100
 * @route '/api/v1/staff/{staff}'
 */
    const updateForm = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Staff\Controllers\StaffController::update
 * @see app/Modules/Staff/Controllers/StaffController.php:100
 * @route '/api/v1/staff/{staff}'
 */
        updateForm.put = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Modules\Staff\Controllers\StaffController::update
 * @see app/Modules/Staff/Controllers/StaffController.php:100
 * @route '/api/v1/staff/{staff}'
 */
        updateForm.patch = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\Staff\Controllers\StaffController::destroy
 * @see app/Modules/Staff/Controllers/StaffController.php:125
 * @route '/api/v1/staff/{staff}'
 */
export const destroy = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/staff/{staff}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Modules\Staff\Controllers\StaffController::destroy
 * @see app/Modules/Staff/Controllers/StaffController.php:125
 * @route '/api/v1/staff/{staff}'
 */
destroy.url = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Staff\Controllers\StaffController::destroy
 * @see app/Modules/Staff/Controllers/StaffController.php:125
 * @route '/api/v1/staff/{staff}'
 */
destroy.delete = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Modules\Staff\Controllers\StaffController::destroy
 * @see app/Modules/Staff/Controllers/StaffController.php:125
 * @route '/api/v1/staff/{staff}'
 */
    const destroyForm = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Staff\Controllers\StaffController::destroy
 * @see app/Modules/Staff/Controllers/StaffController.php:125
 * @route '/api/v1/staff/{staff}'
 */
        destroyForm.delete = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\Staff\Controllers\StaffController::suspend
 * @see app/Modules/Staff/Controllers/StaffController.php:134
 * @route '/api/v1/staff/{staff}/suspend'
 */
export const suspend = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: suspend.url(args, options),
    method: 'patch',
})

suspend.definition = {
    methods: ["patch"],
    url: '/api/v1/staff/{staff}/suspend',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Staff\Controllers\StaffController::suspend
 * @see app/Modules/Staff/Controllers/StaffController.php:134
 * @route '/api/v1/staff/{staff}/suspend'
 */
suspend.url = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return suspend.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Staff\Controllers\StaffController::suspend
 * @see app/Modules/Staff/Controllers/StaffController.php:134
 * @route '/api/v1/staff/{staff}/suspend'
 */
suspend.patch = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: suspend.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Staff\Controllers\StaffController::suspend
 * @see app/Modules/Staff/Controllers/StaffController.php:134
 * @route '/api/v1/staff/{staff}/suspend'
 */
    const suspendForm = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: suspend.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Staff\Controllers\StaffController::suspend
 * @see app/Modules/Staff/Controllers/StaffController.php:134
 * @route '/api/v1/staff/{staff}/suspend'
 */
        suspendForm.patch = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: suspend.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    suspend.form = suspendForm
/**
* @see \App\Modules\Staff\Controllers\StaffController::activate
 * @see app/Modules/Staff/Controllers/StaffController.php:147
 * @route '/api/v1/staff/{staff}/activate'
 */
export const activate = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: activate.url(args, options),
    method: 'patch',
})

activate.definition = {
    methods: ["patch"],
    url: '/api/v1/staff/{staff}/activate',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Staff\Controllers\StaffController::activate
 * @see app/Modules/Staff/Controllers/StaffController.php:147
 * @route '/api/v1/staff/{staff}/activate'
 */
activate.url = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return activate.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Staff\Controllers\StaffController::activate
 * @see app/Modules/Staff/Controllers/StaffController.php:147
 * @route '/api/v1/staff/{staff}/activate'
 */
activate.patch = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: activate.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Staff\Controllers\StaffController::activate
 * @see app/Modules/Staff/Controllers/StaffController.php:147
 * @route '/api/v1/staff/{staff}/activate'
 */
    const activateForm = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: activate.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Staff\Controllers\StaffController::activate
 * @see app/Modules/Staff/Controllers/StaffController.php:147
 * @route '/api/v1/staff/{staff}/activate'
 */
        activateForm.patch = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: activate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    activate.form = activateForm
/**
* @see \App\Modules\Staff\Controllers\StaffController::assignBranches
 * @see app/Modules/Staff/Controllers/StaffController.php:158
 * @route '/api/v1/staff/{staff}/branches'
 */
export const assignBranches = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: assignBranches.url(args, options),
    method: 'put',
})

assignBranches.definition = {
    methods: ["put"],
    url: '/api/v1/staff/{staff}/branches',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Modules\Staff\Controllers\StaffController::assignBranches
 * @see app/Modules/Staff/Controllers/StaffController.php:158
 * @route '/api/v1/staff/{staff}/branches'
 */
assignBranches.url = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return assignBranches.definition.url
            .replace('{staff}', parsedArgs.staff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Staff\Controllers\StaffController::assignBranches
 * @see app/Modules/Staff/Controllers/StaffController.php:158
 * @route '/api/v1/staff/{staff}/branches'
 */
assignBranches.put = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: assignBranches.url(args, options),
    method: 'put',
})

    /**
* @see \App\Modules\Staff\Controllers\StaffController::assignBranches
 * @see app/Modules/Staff/Controllers/StaffController.php:158
 * @route '/api/v1/staff/{staff}/branches'
 */
    const assignBranchesForm = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assignBranches.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Staff\Controllers\StaffController::assignBranches
 * @see app/Modules/Staff/Controllers/StaffController.php:158
 * @route '/api/v1/staff/{staff}/branches'
 */
        assignBranchesForm.put = (args: { staff: number | { id: number } } | [staff: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assignBranches.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    assignBranches.form = assignBranchesForm
const StaffController = { index, store, show, update, destroy, suspend, activate, assignBranches }

export default StaffController