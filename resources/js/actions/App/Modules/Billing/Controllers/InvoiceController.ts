import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Billing\Controllers\InvoiceController::index
 * @see app/Modules/Billing/Controllers/InvoiceController.php:19
 * @route '/api/v1/billing/invoices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/billing/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Billing\Controllers\InvoiceController::index
 * @see app/Modules/Billing/Controllers/InvoiceController.php:19
 * @route '/api/v1/billing/invoices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\InvoiceController::index
 * @see app/Modules/Billing/Controllers/InvoiceController.php:19
 * @route '/api/v1/billing/invoices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Billing\Controllers\InvoiceController::index
 * @see app/Modules/Billing/Controllers/InvoiceController.php:19
 * @route '/api/v1/billing/invoices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Billing\Controllers\InvoiceController::index
 * @see app/Modules/Billing/Controllers/InvoiceController.php:19
 * @route '/api/v1/billing/invoices'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Billing\Controllers\InvoiceController::index
 * @see app/Modules/Billing/Controllers/InvoiceController.php:19
 * @route '/api/v1/billing/invoices'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Billing\Controllers\InvoiceController::index
 * @see app/Modules/Billing/Controllers/InvoiceController.php:19
 * @route '/api/v1/billing/invoices'
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
* @see \App\Modules\Billing\Controllers\InvoiceController::store
 * @see app/Modules/Billing/Controllers/InvoiceController.php:46
 * @route '/api/v1/billing/invoices'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/billing/invoices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Billing\Controllers\InvoiceController::store
 * @see app/Modules/Billing/Controllers/InvoiceController.php:46
 * @route '/api/v1/billing/invoices'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\InvoiceController::store
 * @see app/Modules/Billing/Controllers/InvoiceController.php:46
 * @route '/api/v1/billing/invoices'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Billing\Controllers\InvoiceController::store
 * @see app/Modules/Billing/Controllers/InvoiceController.php:46
 * @route '/api/v1/billing/invoices'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Billing\Controllers\InvoiceController::store
 * @see app/Modules/Billing/Controllers/InvoiceController.php:46
 * @route '/api/v1/billing/invoices'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Billing\Controllers\InvoiceController::show
 * @see app/Modules/Billing/Controllers/InvoiceController.php:64
 * @route '/api/v1/billing/invoices/{invoice}'
 */
export const show = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/billing/invoices/{invoice}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Billing\Controllers\InvoiceController::show
 * @see app/Modules/Billing/Controllers/InvoiceController.php:64
 * @route '/api/v1/billing/invoices/{invoice}'
 */
show.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\InvoiceController::show
 * @see app/Modules/Billing/Controllers/InvoiceController.php:64
 * @route '/api/v1/billing/invoices/{invoice}'
 */
show.get = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Billing\Controllers\InvoiceController::show
 * @see app/Modules/Billing/Controllers/InvoiceController.php:64
 * @route '/api/v1/billing/invoices/{invoice}'
 */
show.head = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Billing\Controllers\InvoiceController::show
 * @see app/Modules/Billing/Controllers/InvoiceController.php:64
 * @route '/api/v1/billing/invoices/{invoice}'
 */
    const showForm = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Billing\Controllers\InvoiceController::show
 * @see app/Modules/Billing/Controllers/InvoiceController.php:64
 * @route '/api/v1/billing/invoices/{invoice}'
 */
        showForm.get = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Billing\Controllers\InvoiceController::show
 * @see app/Modules/Billing/Controllers/InvoiceController.php:64
 * @route '/api/v1/billing/invoices/{invoice}'
 */
        showForm.head = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const InvoiceController = { index, store, show }

export default InvoiceController