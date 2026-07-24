import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/renewals/expired',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::index
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
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
const MembershipExpiredController = { index }

export default MembershipExpiredController