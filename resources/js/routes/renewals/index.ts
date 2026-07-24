import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import reminders from './reminders'
/**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::dashboard
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/renewals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::dashboard
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::dashboard
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::dashboard
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::dashboard
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::dashboard
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\RenewalDashboardController::dashboard
 * @see app/Modules/Membership/Controllers/RenewalDashboardController.php:17
 * @route '/renewals'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::expiring
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
export const expiring = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expiring.url(options),
    method: 'get',
})

expiring.definition = {
    methods: ["get","head"],
    url: '/renewals/expiring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::expiring
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
expiring.url = (options?: RouteQueryOptions) => {
    return expiring.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::expiring
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
expiring.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expiring.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::expiring
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
expiring.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: expiring.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::expiring
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
    const expiringForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: expiring.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::expiring
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
        expiringForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expiring.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipExpiringController::expiring
 * @see app/Modules/Membership/Controllers/MembershipExpiringController.php:16
 * @route '/renewals/expiring'
 */
        expiringForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expiring.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    expiring.form = expiringForm
/**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::expired
 * @see app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
export const expired = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expired.url(options),
    method: 'get',
})

expired.definition = {
    methods: ["get","head"],
    url: '/renewals/expired',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::expired
 * @see app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
expired.url = (options?: RouteQueryOptions) => {
    return expired.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::expired
 * @see app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
expired.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expired.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::expired
 * @see app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
expired.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: expired.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::expired
 * @see app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
    const expiredForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: expired.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::expired
 * @see app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
        expiredForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expired.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipExpiredController::expired
 * @see app/Modules/Membership/Controllers/MembershipExpiredController.php:16
 * @route '/renewals/expired'
 */
        expiredForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expired.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    expired.form = expiredForm
/**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::grace
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
export const grace = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: grace.url(options),
    method: 'get',
})

grace.definition = {
    methods: ["get","head"],
    url: '/renewals/grace',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::grace
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
grace.url = (options?: RouteQueryOptions) => {
    return grace.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::grace
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
grace.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: grace.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::grace
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
grace.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: grace.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::grace
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
    const graceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: grace.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::grace
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
        graceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: grace.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Membership\Controllers\MembershipGraceController::grace
 * @see app/Modules/Membership/Controllers/MembershipGraceController.php:16
 * @route '/renewals/grace'
 */
        graceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: grace.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    grace.form = graceForm
const renewals = {
    dashboard: Object.assign(dashboard, dashboard),
expiring: Object.assign(expiring, expiring),
expired: Object.assign(expired, expired),
grace: Object.assign(grace, grace),
reminders: Object.assign(reminders, reminders),
}

export default renewals