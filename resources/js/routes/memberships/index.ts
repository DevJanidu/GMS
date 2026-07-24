import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import renew from './renew'
/**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/memberships',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
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
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/memberships/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
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
* @see \App\Modules\Membership\Controllers\MembershipController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:81
 * @route '/memberships'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/memberships',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:81
 * @route '/memberships'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:81
 * @route '/memberships'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:81
 * @route '/memberships'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:81
 * @route '/memberships'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
export const show = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/memberships/{membership}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
show.url = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { membership: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { membership: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    membership: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        membership: typeof args.membership === 'object'
                ? args.membership.id
                : args.membership,
                }

    return show.definition.url
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
show.get = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
show.head = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
    const showForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
        showForm.get = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
        showForm.head = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Modules\Membership\Controllers\MembershipFreezeController::freeze
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipFreezeController.php:15
 * @route '/memberships/{membership}/freeze'
 */
export const freeze = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: freeze.url(args, options),
    method: 'patch',
})

freeze.definition = {
    methods: ["patch"],
    url: '/memberships/{membership}/freeze',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipFreezeController::freeze
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipFreezeController.php:15
 * @route '/memberships/{membership}/freeze'
 */
freeze.url = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { membership: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { membership: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    membership: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        membership: typeof args.membership === 'object'
                ? args.membership.id
                : args.membership,
                }

    return freeze.definition.url
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipFreezeController::freeze
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipFreezeController.php:15
 * @route '/memberships/{membership}/freeze'
 */
freeze.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: freeze.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipFreezeController::freeze
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipFreezeController.php:15
 * @route '/memberships/{membership}/freeze'
 */
    const freezeForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: freeze.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipFreezeController::freeze
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipFreezeController.php:15
 * @route '/memberships/{membership}/freeze'
 */
        freezeForm.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: freeze.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    freeze.form = freezeForm
/**
* @see \App\Modules\Membership\Controllers\MembershipResumeController::resume
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipResumeController.php:14
 * @route '/memberships/{membership}/resume'
 */
export const resume = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resume.url(args, options),
    method: 'patch',
})

resume.definition = {
    methods: ["patch"],
    url: '/memberships/{membership}/resume',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipResumeController::resume
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipResumeController.php:14
 * @route '/memberships/{membership}/resume'
 */
resume.url = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { membership: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { membership: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    membership: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        membership: typeof args.membership === 'object'
                ? args.membership.id
                : args.membership,
                }

    return resume.definition.url
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipResumeController::resume
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipResumeController.php:14
 * @route '/memberships/{membership}/resume'
 */
resume.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resume.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipResumeController::resume
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipResumeController.php:14
 * @route '/memberships/{membership}/resume'
 */
    const resumeForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resume.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipResumeController::resume
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipResumeController.php:14
 * @route '/memberships/{membership}/resume'
 */
        resumeForm.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resume.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    resume.form = resumeForm
/**
* @see \App\Modules\Membership\Controllers\MembershipSuspensionController::suspend
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipSuspensionController.php:14
 * @route '/memberships/{membership}/suspend'
 */
export const suspend = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: suspend.url(args, options),
    method: 'patch',
})

suspend.definition = {
    methods: ["patch"],
    url: '/memberships/{membership}/suspend',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipSuspensionController::suspend
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipSuspensionController.php:14
 * @route '/memberships/{membership}/suspend'
 */
suspend.url = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { membership: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { membership: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    membership: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        membership: typeof args.membership === 'object'
                ? args.membership.id
                : args.membership,
                }

    return suspend.definition.url
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipSuspensionController::suspend
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipSuspensionController.php:14
 * @route '/memberships/{membership}/suspend'
 */
suspend.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: suspend.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipSuspensionController::suspend
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipSuspensionController.php:14
 * @route '/memberships/{membership}/suspend'
 */
    const suspendForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: suspend.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipSuspensionController::suspend
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipSuspensionController.php:14
 * @route '/memberships/{membership}/suspend'
 */
        suspendForm.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Modules\Membership\Controllers\MembershipCancellationController::cancel
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipCancellationController.php:14
 * @route '/memberships/{membership}/cancel'
 */
export const cancel = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

cancel.definition = {
    methods: ["patch"],
    url: '/memberships/{membership}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipCancellationController::cancel
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipCancellationController.php:14
 * @route '/memberships/{membership}/cancel'
 */
cancel.url = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { membership: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { membership: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    membership: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        membership: typeof args.membership === 'object'
                ? args.membership.id
                : args.membership,
                }

    return cancel.definition.url
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipCancellationController::cancel
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipCancellationController.php:14
 * @route '/memberships/{membership}/cancel'
 */
cancel.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipCancellationController::cancel
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipCancellationController.php:14
 * @route '/memberships/{membership}/cancel'
 */
    const cancelForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipCancellationController::cancel
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipCancellationController.php:14
 * @route '/memberships/{membership}/cancel'
 */
        cancelForm.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Modules\Membership\Controllers\MembershipReactivationController::reactivate
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipReactivationController.php:14
 * @route '/memberships/{membership}/reactivate'
 */
export const reactivate = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reactivate.url(args, options),
    method: 'patch',
})

reactivate.definition = {
    methods: ["patch"],
    url: '/memberships/{membership}/reactivate',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipReactivationController::reactivate
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipReactivationController.php:14
 * @route '/memberships/{membership}/reactivate'
 */
reactivate.url = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { membership: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { membership: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    membership: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        membership: typeof args.membership === 'object'
                ? args.membership.id
                : args.membership,
                }

    return reactivate.definition.url
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipReactivationController::reactivate
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipReactivationController.php:14
 * @route '/memberships/{membership}/reactivate'
 */
reactivate.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: reactivate.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipReactivationController::reactivate
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipReactivationController.php:14
 * @route '/memberships/{membership}/reactivate'
 */
    const reactivateForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reactivate.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipReactivationController::reactivate
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipReactivationController.php:14
 * @route '/memberships/{membership}/reactivate'
 */
        reactivateForm.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reactivate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    reactivate.form = reactivateForm
const memberships = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
renew: Object.assign(renew, renew),
freeze: Object.assign(freeze, freeze),
resume: Object.assign(resume, resume),
suspend: Object.assign(suspend, suspend),
cancel: Object.assign(cancel, cancel),
reactivate: Object.assign(reactivate, reactivate),
}

export default memberships