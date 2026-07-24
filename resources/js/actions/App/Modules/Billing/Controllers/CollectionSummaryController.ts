import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
const CollectionSummaryController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CollectionSummaryController.url(options),
    method: 'get',
})

CollectionSummaryController.definition = {
    methods: ["get","head"],
    url: '/api/v1/billing/collection-summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
CollectionSummaryController.url = (options?: RouteQueryOptions) => {
    return CollectionSummaryController.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
CollectionSummaryController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CollectionSummaryController.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
CollectionSummaryController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CollectionSummaryController.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
    const CollectionSummaryControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: CollectionSummaryController.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
        CollectionSummaryControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CollectionSummaryController.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
        CollectionSummaryControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CollectionSummaryController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    CollectionSummaryController.form = CollectionSummaryControllerForm
export default CollectionSummaryController