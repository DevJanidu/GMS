import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::index
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/renewals/expiring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::index
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::index
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::index
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::index
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::index
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::index
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
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
const MembershipExpiringController = { index }

export default MembershipExpiringController