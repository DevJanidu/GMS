import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/billing/outstanding-balances',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
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
const outstanding = {
    index: Object.assign(index, index),
}

export default outstanding