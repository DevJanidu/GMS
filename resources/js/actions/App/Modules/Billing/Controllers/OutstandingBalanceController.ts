import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
const OutstandingBalanceController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OutstandingBalanceController.url(options),
    method: 'get',
})

OutstandingBalanceController.definition = {
    methods: ["get","head"],
    url: '/api/v1/billing/outstanding-balances',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
OutstandingBalanceController.url = (options?: RouteQueryOptions) => {
    return OutstandingBalanceController.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
OutstandingBalanceController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OutstandingBalanceController.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
OutstandingBalanceController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: OutstandingBalanceController.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
    const OutstandingBalanceControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: OutstandingBalanceController.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
        OutstandingBalanceControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: OutstandingBalanceController.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Billing\Controllers\OutstandingBalanceController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/OutstandingBalanceController.php:16
 * @route '/api/v1/billing/outstanding-balances'
 */
        OutstandingBalanceControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: OutstandingBalanceController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    OutstandingBalanceController.form = OutstandingBalanceControllerForm
export default OutstandingBalanceController