import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Membership\Controllers\MembershipCancellationController::update
 * @see app/Modules/Membership/Controllers/MembershipCancellationController.php:14
 * @route '/memberships/{membership}/cancel'
 */
export const update = (args: { membership: string | number | { id: string | number } } | [membership: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/memberships/{membership}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipCancellationController::update
 * @see app/Modules/Membership/Controllers/MembershipCancellationController.php:14
 * @route '/memberships/{membership}/cancel'
 */
update.url = (args: { membership: string | number | { id: string | number } } | [membership: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { membership: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { membership: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    membership: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        membership: typeof args.membership === 'object'
                ? args.membership.id
                : args.membership,
                }

    return update.definition.url
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipCancellationController::update
 * @see app/Modules/Membership/Controllers/MembershipCancellationController.php:14
 * @route '/memberships/{membership}/cancel'
 */
update.patch = (args: { membership: string | number | { id: string | number } } | [membership: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipCancellationController::update
 * @see app/Modules/Membership/Controllers/MembershipCancellationController.php:14
 * @route '/memberships/{membership}/cancel'
 */
    const updateForm = (args: { membership: string | number | { id: string | number } } | [membership: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipCancellationController::update
 * @see app/Modules/Membership/Controllers/MembershipCancellationController.php:14
 * @route '/memberships/{membership}/cancel'
 */
        updateForm.patch = (args: { membership: string | number | { id: string | number } } | [membership: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const MembershipCancellationController = { update }

export default MembershipCancellationController