import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalInviteController::store
 * @see app/Modules/MemberPortal/Controllers/MemberPortalInviteController.php:19
 * @route '/members/{member}/portal-invite'
 */
export const store = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/members/{member}/portal-invite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalInviteController::store
 * @see app/Modules/MemberPortal/Controllers/MemberPortalInviteController.php:19
 * @route '/members/{member}/portal-invite'
 */
store.url = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { member: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                }

    return store.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalInviteController::store
 * @see app/Modules/MemberPortal/Controllers/MemberPortalInviteController.php:19
 * @route '/members/{member}/portal-invite'
 */
store.post = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalInviteController::store
 * @see app/Modules/MemberPortal/Controllers/MemberPortalInviteController.php:19
 * @route '/members/{member}/portal-invite'
 */
    const storeForm = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalInviteController::store
 * @see app/Modules/MemberPortal/Controllers/MemberPortalInviteController.php:19
 * @route '/members/{member}/portal-invite'
 */
        storeForm.post = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const MemberPortalInviteController = { store }

export default MemberPortalInviteController