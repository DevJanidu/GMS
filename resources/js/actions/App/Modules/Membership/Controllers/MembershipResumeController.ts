import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Membership\Controllers\MembershipResumeController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipResumeController.php:14
 * @route '/memberships/{membership}/resume'
 */
export const update = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/memberships/{membership}/resume',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipResumeController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipResumeController.php:14
 * @route '/memberships/{membership}/resume'
 */
update.url = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Modules\Membership\Controllers\MembershipResumeController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipResumeController.php:14
 * @route '/memberships/{membership}/resume'
 */
update.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipResumeController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipResumeController.php:14
 * @route '/memberships/{membership}/resume'
 */
    const updateForm = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipResumeController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipResumeController.php:14
 * @route '/memberships/{membership}/resume'
 */
        updateForm.patch = (args: { membership: number | { id: number } } | [membership: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const MembershipResumeController = { update }

export default MembershipResumeController