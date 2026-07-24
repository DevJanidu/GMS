import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Billing\Controllers\RefundController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:19
 * @route '/api/v1/billing/payments/{payment}/refunds'
 */
export const store = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/billing/payments/{payment}/refunds',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Billing\Controllers\RefundController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:19
 * @route '/api/v1/billing/payments/{payment}/refunds'
 */
store.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: typeof args.payment === 'object'
                ? args.payment.id
                : args.payment,
                }

    return store.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\RefundController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:19
 * @route '/api/v1/billing/payments/{payment}/refunds'
 */
store.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Billing\Controllers\RefundController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:19
 * @route '/api/v1/billing/payments/{payment}/refunds'
 */
    const storeForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Billing\Controllers\RefundController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:19
 * @route '/api/v1/billing/payments/{payment}/refunds'
 */
        storeForm.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Billing\Controllers\RefundController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:39
 * @route '/api/v1/billing/refunds/{refund}'
 */
export const show = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/billing/refunds/{refund}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Billing\Controllers\RefundController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:39
 * @route '/api/v1/billing/refunds/{refund}'
 */
show.url = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { refund: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { refund: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    refund: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        refund: typeof args.refund === 'object'
                ? args.refund.id
                : args.refund,
                }

    return show.definition.url
            .replace('{refund}', parsedArgs.refund.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\RefundController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:39
 * @route '/api/v1/billing/refunds/{refund}'
 */
show.get = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Billing\Controllers\RefundController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:39
 * @route '/api/v1/billing/refunds/{refund}'
 */
show.head = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Billing\Controllers\RefundController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:39
 * @route '/api/v1/billing/refunds/{refund}'
 */
    const showForm = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Billing\Controllers\RefundController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:39
 * @route '/api/v1/billing/refunds/{refund}'
 */
        showForm.get = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Billing\Controllers\RefundController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/RefundController.php:39
 * @route '/api/v1/billing/refunds/{refund}'
 */
        showForm.head = (args: { refund: number | { id: number } } | [refund: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const RefundController = { store, show }

export default RefundController