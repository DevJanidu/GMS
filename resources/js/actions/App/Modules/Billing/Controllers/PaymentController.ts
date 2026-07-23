import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Billing\Controllers\PaymentController::store
 * @see app/Modules/Billing/Controllers/PaymentController.php:41
 * @route '/api/v1/billing/invoices/{invoice}/payments'
 */
export const store = (args: { invoice: string | number | { id: string | number } } | [invoice: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/billing/invoices/{invoice}/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Billing\Controllers\PaymentController::store
 * @see app/Modules/Billing/Controllers/PaymentController.php:41
 * @route '/api/v1/billing/invoices/{invoice}/payments'
 */
store.url = (args: { invoice: string | number | { id: string | number } } | [invoice: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { invoice: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invoice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoice: typeof args.invoice === 'object'
                ? args.invoice.id
                : args.invoice,
                }

    return store.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\PaymentController::store
 * @see app/Modules/Billing/Controllers/PaymentController.php:41
 * @route '/api/v1/billing/invoices/{invoice}/payments'
 */
store.post = (args: { invoice: string | number | { id: string | number } } | [invoice: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Billing\Controllers\PaymentController::store
 * @see app/Modules/Billing/Controllers/PaymentController.php:41
 * @route '/api/v1/billing/invoices/{invoice}/payments'
 */
    const storeForm = (args: { invoice: string | number | { id: string | number } } | [invoice: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Billing\Controllers\PaymentController::store
 * @see app/Modules/Billing/Controllers/PaymentController.php:41
 * @route '/api/v1/billing/invoices/{invoice}/payments'
 */
        storeForm.post = (args: { invoice: string | number | { id: string | number } } | [invoice: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Billing\Controllers\PaymentController::split
 * @see app/Modules/Billing/Controllers/PaymentController.php:65
 * @route '/api/v1/billing/invoices/{invoice}/split-payments'
 */
export const split = (args: { invoice: string | number | { id: string | number } } | [invoice: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: split.url(args, options),
    method: 'post',
})

split.definition = {
    methods: ["post"],
    url: '/api/v1/billing/invoices/{invoice}/split-payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Billing\Controllers\PaymentController::split
 * @see app/Modules/Billing/Controllers/PaymentController.php:65
 * @route '/api/v1/billing/invoices/{invoice}/split-payments'
 */
split.url = (args: { invoice: string | number | { id: string | number } } | [invoice: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { invoice: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    invoice: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        invoice: typeof args.invoice === 'object'
                ? args.invoice.id
                : args.invoice,
                }

    return split.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\PaymentController::split
 * @see app/Modules/Billing/Controllers/PaymentController.php:65
 * @route '/api/v1/billing/invoices/{invoice}/split-payments'
 */
split.post = (args: { invoice: string | number | { id: string | number } } | [invoice: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: split.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Billing\Controllers\PaymentController::split
 * @see app/Modules/Billing/Controllers/PaymentController.php:65
 * @route '/api/v1/billing/invoices/{invoice}/split-payments'
 */
    const splitForm = (args: { invoice: string | number | { id: string | number } } | [invoice: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: split.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Billing\Controllers\PaymentController::split
 * @see app/Modules/Billing/Controllers/PaymentController.php:65
 * @route '/api/v1/billing/invoices/{invoice}/split-payments'
 */
        splitForm.post = (args: { invoice: string | number | { id: string | number } } | [invoice: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: split.url(args, options),
            method: 'post',
        })
    
    split.form = splitForm
/**
* @see \App\Modules\Billing\Controllers\PaymentController::index
 * @see app/Modules/Billing/Controllers/PaymentController.php:22
 * @route '/api/v1/billing/payments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/billing/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Billing\Controllers\PaymentController::index
 * @see app/Modules/Billing/Controllers/PaymentController.php:22
 * @route '/api/v1/billing/payments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\PaymentController::index
 * @see app/Modules/Billing/Controllers/PaymentController.php:22
 * @route '/api/v1/billing/payments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Billing\Controllers\PaymentController::index
 * @see app/Modules/Billing/Controllers/PaymentController.php:22
 * @route '/api/v1/billing/payments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Billing\Controllers\PaymentController::index
 * @see app/Modules/Billing/Controllers/PaymentController.php:22
 * @route '/api/v1/billing/payments'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Billing\Controllers\PaymentController::index
 * @see app/Modules/Billing/Controllers/PaymentController.php:22
 * @route '/api/v1/billing/payments'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Billing\Controllers\PaymentController::index
 * @see app/Modules/Billing/Controllers/PaymentController.php:22
 * @route '/api/v1/billing/payments'
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
const PaymentController = { store, split, index }

export default PaymentController