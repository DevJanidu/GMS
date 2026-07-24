import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::index
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/receipts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::index
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::index
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::index
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::index
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::index
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::index
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
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
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
export const show = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/receipts/{receipt}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
show.url = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { receipt: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    receipt: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        receipt: args.receipt,
                }

    return show.definition.url
            .replace('{receipt}', parsedArgs.receipt.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
show.get = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
show.head = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
    const showForm = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
        showForm.get = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
        showForm.head = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const receipts = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default receipts