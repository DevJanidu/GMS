import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::create
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:17
 * @route '/memberships/{membership}/renew'
 */
export const create = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/memberships/{membership}/renew',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::create
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:17
 * @route '/memberships/{membership}/renew'
 */
create.url = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::create
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:17
 * @route '/memberships/{membership}/renew'
 */
create.get = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::create
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:17
 * @route '/memberships/{membership}/renew'
 */
create.head = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::create
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:17
 * @route '/memberships/{membership}/renew'
 */
    const createForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::create
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:17
 * @route '/memberships/{membership}/renew'
 */
        createForm.get = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::create
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:17
 * @route '/memberships/{membership}/renew'
 */
        createForm.head = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::store
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:44
 * @route '/memberships/{membership}/renew'
 */
export const store = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/memberships/{membership}/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::store
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:44
 * @route '/memberships/{membership}/renew'
 */
store.url = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::store
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:44
 * @route '/memberships/{membership}/renew'
 */
store.post = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::store
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:44
 * @route '/memberships/{membership}/renew'
 */
    const storeForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipRenewalController::store
 * @see app/Modules/Membership/Controllers/MembershipRenewalController.php:44
 * @route '/memberships/{membership}/renew'
 */
        storeForm.post = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const renew = {
    create: Object.assign(create, create),
store: Object.assign(store, store),
}

export default renew