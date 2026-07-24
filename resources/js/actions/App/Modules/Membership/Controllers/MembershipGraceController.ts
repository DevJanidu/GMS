import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::index
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/renewals/grace',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::index
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::index
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::index
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::index
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::index
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::index
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
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
const MembershipGraceController = { index }

export default MembershipGraceController