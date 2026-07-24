import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Billing\Controllers\ReceiptController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:16
 * @route '/api/v1/billing/receipts/{receipt}'
 */
export const show = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/billing/receipts/{receipt}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Billing\Controllers\ReceiptController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:16
 * @route '/api/v1/billing/receipts/{receipt}'
 */
show.url = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { receipt: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { receipt: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    receipt: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        receipt: typeof args.receipt === 'object'
                ? args.receipt.id
                : args.receipt,
                }

    return show.definition.url
            .replace('{receipt}', parsedArgs.receipt.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\ReceiptController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:16
 * @route '/api/v1/billing/receipts/{receipt}'
 */
show.get = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Billing\Controllers\ReceiptController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:16
 * @route '/api/v1/billing/receipts/{receipt}'
 */
show.head = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Billing\Controllers\ReceiptController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:16
 * @route '/api/v1/billing/receipts/{receipt}'
 */
    const showForm = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Billing\Controllers\ReceiptController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:16
 * @route '/api/v1/billing/receipts/{receipt}'
 */
        showForm.get = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Billing\Controllers\ReceiptController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:16
 * @route '/api/v1/billing/receipts/{receipt}'
 */
        showForm.head = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Modules\Billing\Controllers\ReceiptController::print
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:24
 * @route '/api/v1/billing/receipts/{receipt}/print'
 */
export const print = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/api/v1/billing/receipts/{receipt}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Billing\Controllers\ReceiptController::print
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:24
 * @route '/api/v1/billing/receipts/{receipt}/print'
 */
print.url = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { receipt: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { receipt: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    receipt: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        receipt: typeof args.receipt === 'object'
                ? args.receipt.id
                : args.receipt,
                }

    return print.definition.url
            .replace('{receipt}', parsedArgs.receipt.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\ReceiptController::print
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:24
 * @route '/api/v1/billing/receipts/{receipt}/print'
 */
print.get = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Billing\Controllers\ReceiptController::print
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:24
 * @route '/api/v1/billing/receipts/{receipt}/print'
 */
print.head = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Billing\Controllers\ReceiptController::print
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:24
 * @route '/api/v1/billing/receipts/{receipt}/print'
 */
    const printForm = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: print.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Billing\Controllers\ReceiptController::print
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:24
 * @route '/api/v1/billing/receipts/{receipt}/print'
 */
        printForm.get = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Billing\Controllers\ReceiptController::print
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/ReceiptController.php:24
 * @route '/api/v1/billing/receipts/{receipt}/print'
 */
        printForm.head = (args: { receipt: number | { id: number } } | [receipt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    print.form = printForm
const ReceiptController = { show, print }

export default ReceiptController