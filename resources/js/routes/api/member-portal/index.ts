import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import profile from './profile'
import receipts from './receipts'
import notifications1ce82a from './notifications'
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::dashboard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::dashboard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::dashboard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::dashboard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::dashboard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::dashboard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::dashboard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/dashboard'
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
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::qrCard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/qr-card'
 */
export const qrCard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qrCard.url(options),
    method: 'get',
})

qrCard.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/qr-card',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::qrCard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/qr-card'
 */
qrCard.url = (options?: RouteQueryOptions) => {
    return qrCard.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::qrCard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/qr-card'
 */
qrCard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qrCard.url(options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::qrCard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/qr-card'
 */
qrCard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qrCard.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::qrCard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/qr-card'
 */
    const qrCardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: qrCard.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::qrCard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/qr-card'
 */
        qrCardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qrCard.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::qrCard
 * @see [unknown]:0
 * @route '/api/v1/member-portal/qr-card'
 */
        qrCardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qrCard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    qrCard.form = qrCardForm
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::membership
 * @see [unknown]:0
 * @route '/api/v1/member-portal/membership'
 */
export const membership = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: membership.url(options),
    method: 'get',
})

membership.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/membership',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::membership
 * @see [unknown]:0
 * @route '/api/v1/member-portal/membership'
 */
membership.url = (options?: RouteQueryOptions) => {
    return membership.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::membership
 * @see [unknown]:0
 * @route '/api/v1/member-portal/membership'
 */
membership.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: membership.url(options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::membership
 * @see [unknown]:0
 * @route '/api/v1/member-portal/membership'
 */
membership.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: membership.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::membership
 * @see [unknown]:0
 * @route '/api/v1/member-portal/membership'
 */
    const membershipForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: membership.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::membership
 * @see [unknown]:0
 * @route '/api/v1/member-portal/membership'
 */
        membershipForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: membership.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::membership
 * @see [unknown]:0
 * @route '/api/v1/member-portal/membership'
 */
        membershipForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: membership.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    membership.form = membershipForm
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::payments
 * @see [unknown]:0
 * @route '/api/v1/member-portal/payments'
 */
export const payments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})

payments.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::payments
 * @see [unknown]:0
 * @route '/api/v1/member-portal/payments'
 */
payments.url = (options?: RouteQueryOptions) => {
    return payments.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::payments
 * @see [unknown]:0
 * @route '/api/v1/member-portal/payments'
 */
payments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::payments
 * @see [unknown]:0
 * @route '/api/v1/member-portal/payments'
 */
payments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payments.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::payments
 * @see [unknown]:0
 * @route '/api/v1/member-portal/payments'
 */
    const paymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payments.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::payments
 * @see [unknown]:0
 * @route '/api/v1/member-portal/payments'
 */
        paymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::payments
 * @see [unknown]:0
 * @route '/api/v1/member-portal/payments'
 */
        paymentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payments.form = paymentsForm
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::attendance
 * @see [unknown]:0
 * @route '/api/v1/member-portal/attendance'
 */
export const attendance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attendance.url(options),
    method: 'get',
})

attendance.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::attendance
 * @see [unknown]:0
 * @route '/api/v1/member-portal/attendance'
 */
attendance.url = (options?: RouteQueryOptions) => {
    return attendance.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::attendance
 * @see [unknown]:0
 * @route '/api/v1/member-portal/attendance'
 */
attendance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attendance.url(options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::attendance
 * @see [unknown]:0
 * @route '/api/v1/member-portal/attendance'
 */
attendance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: attendance.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::attendance
 * @see [unknown]:0
 * @route '/api/v1/member-portal/attendance'
 */
    const attendanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: attendance.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::attendance
 * @see [unknown]:0
 * @route '/api/v1/member-portal/attendance'
 */
        attendanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attendance.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::attendance
 * @see [unknown]:0
 * @route '/api/v1/member-portal/attendance'
 */
        attendanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attendance.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    attendance.form = attendanceForm
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::notifications
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications'
 */
export const notifications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})

notifications.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::notifications
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications'
 */
notifications.url = (options?: RouteQueryOptions) => {
    return notifications.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::notifications
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications'
 */
notifications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::notifications
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications'
 */
notifications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notifications.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::notifications
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications'
 */
    const notificationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: notifications.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::notifications
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications'
 */
        notificationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::notifications
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications'
 */
        notificationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    notifications.form = notificationsForm
const memberPortal = {
    dashboard: Object.assign(dashboard, dashboard),
profile: Object.assign(profile, profile),
qrCard: Object.assign(qrCard, qrCard),
membership: Object.assign(membership, membership),
payments: Object.assign(payments, payments),
receipts: Object.assign(receipts, receipts),
attendance: Object.assign(attendance, attendance),
notifications: Object.assign(notifications, notifications1ce82a),
}

export default memberPortal