import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
export const summary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})

summary.definition = {
    methods: ["get","head"],
    url: '/api/v1/billing/collection-summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
summary.url = (options?: RouteQueryOptions) => {
    return summary.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
summary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
summary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: summary.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
    const summaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: summary.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
        summaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Billing\Controllers\CollectionSummaryController::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Billing/Controllers/CollectionSummaryController.php:17
 * @route '/api/v1/billing/collection-summary'
 */
        summaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    summary.form = summaryForm
const collections = {
    summary: Object.assign(summary, summary),
}

export default collections