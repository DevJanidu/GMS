import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see app/Modules/Membership/Controllers/MembershipController.php:23
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
 * @see app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see app/Modules/Membership/Controllers/MembershipController.php:23
 * @route '/memberships'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipController::index
 * @see app/Modules/Membership/Controllers/MembershipController.php:23
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
 * @see app/Modules/Membership/Controllers/MembershipController.php:57
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
 * @see app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see app/Modules/Membership/Controllers/MembershipController.php:57
 * @route '/memberships/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipController::create
 * @see app/Modules/Membership/Controllers/MembershipController.php:57
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
 * @see app/Modules/Membership/Controllers/MembershipController.php:81
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
 * @see app/Modules/Membership/Controllers/MembershipController.php:81
 * @route '/memberships'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipController::store
 * @see app/Modules/Membership/Controllers/MembershipController.php:81
 * @route '/memberships'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipController::store
 * @see app/Modules/Membership/Controllers/MembershipController.php:81
 * @route '/memberships'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipController::store
 * @see app/Modules/Membership/Controllers/MembershipController.php:81
 * @route '/memberships'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see app/Modules/Membership/Controllers/MembershipController.php:113
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
 * @see app/Modules/Membership/Controllers/MembershipController.php:113
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
 * @see app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
show.get = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
show.head = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
    const showForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see app/Modules/Membership/Controllers/MembershipController.php:113
 * @route '/memberships/{membership}'
 */
        showForm.get = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipController::show
 * @see app/Modules/Membership/Controllers/MembershipController.php:113
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
const MembershipController = { index, create, store, show }

export default MembershipController