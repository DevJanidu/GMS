import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/member-portal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
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
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
export const qrCard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qrCard.url(options),
    method: 'get',
})

qrCard.definition = {
    methods: ["get","head"],
    url: '/member-portal/qr-card',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
qrCard.url = (options?: RouteQueryOptions) => {
    return qrCard.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
qrCard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qrCard.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
qrCard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qrCard.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
    const qrCardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: qrCard.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
        qrCardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qrCard.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
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
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
export const membership = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: membership.url(options),
    method: 'get',
})

membership.definition = {
    methods: ["get","head"],
    url: '/member-portal/membership',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
membership.url = (options?: RouteQueryOptions) => {
    return membership.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
membership.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: membership.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
membership.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: membership.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
    const membershipForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: membership.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
        membershipForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: membership.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
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
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
export const payments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})

payments.definition = {
    methods: ["get","head"],
    url: '/member-portal/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
payments.url = (options?: RouteQueryOptions) => {
    return payments.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
payments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
payments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payments.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
    const paymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payments.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
        paymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
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
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
export const receipts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipts.url(options),
    method: 'get',
})

receipts.definition = {
    methods: ["get","head"],
    url: '/member-portal/receipts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
receipts.url = (options?: RouteQueryOptions) => {
    return receipts.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
receipts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipts.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
receipts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: receipts.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
    const receiptsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: receipts.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
        receiptsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: receipts.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
        receiptsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: receipts.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    receipts.form = receiptsForm
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
export const attendance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attendance.url(options),
    method: 'get',
})

attendance.definition = {
    methods: ["get","head"],
    url: '/member-portal/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
attendance.url = (options?: RouteQueryOptions) => {
    return attendance.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
attendance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attendance.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
attendance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: attendance.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
    const attendanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: attendance.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
        attendanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attendance.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
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
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
export const notifications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})

notifications.definition = {
    methods: ["get","head"],
    url: '/member-portal/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
notifications.url = (options?: RouteQueryOptions) => {
    return notifications.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
notifications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
notifications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notifications.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
    const notificationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: notifications.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
        notificationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
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
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/member-portal/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
    const profileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profile.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
        profileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
        profileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    profile.form = profileForm
const memberPortal = {
    dashboard: Object.assign(dashboard, dashboard),
qrCard: Object.assign(qrCard, qrCard),
membership: Object.assign(membership, membership),
payments: Object.assign(payments, payments),
receipts: Object.assign(receipts, receipts),
attendance: Object.assign(attendance, attendance),
notifications: Object.assign(notifications, notifications),
profile: Object.assign(profile, profile),
}

export default memberPortal