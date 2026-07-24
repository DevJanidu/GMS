import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::index
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/renewals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::index
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::index
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::index
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::index
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::index
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::index
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
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
const RenewalDashboardController = { index }

export default RenewalDashboardController