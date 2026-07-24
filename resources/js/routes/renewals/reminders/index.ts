import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Modules\Membership\Controllers\MembershipReminderController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipReminderController.php:22
 * @route '/renewals/reminders'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/renewals/reminders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipReminderController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipReminderController.php:22
 * @route '/renewals/reminders'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipReminderController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipReminderController.php:22
 * @route '/renewals/reminders'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipReminderController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipReminderController.php:22
 * @route '/renewals/reminders'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipReminderController::store
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Membership/Controllers/MembershipReminderController.php:22
 * @route '/renewals/reminders'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const reminders = {
    store: Object.assign(store, store),
}

export default reminders