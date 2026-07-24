import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::profile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::profile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::profile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::profile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::profile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
    const profileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profile.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::profile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
        profileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::profile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
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
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::updateProfile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
export const updateProfile = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProfile.url(options),
    method: 'put',
})

updateProfile.definition = {
    methods: ["put"],
    url: '/api/v1/member-portal/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::updateProfile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
updateProfile.url = (options?: RouteQueryOptions) => {
    return updateProfile.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::updateProfile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
updateProfile.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProfile.url(options),
    method: 'put',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::updateProfile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
    const updateProfileForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateProfile.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::updateProfile
 * @see [unknown]:0
 * @route '/api/v1/member-portal/profile'
 */
        updateProfileForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateProfile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateProfile.form = updateProfileForm
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
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipts
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
export const receipts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipts.url(options),
    method: 'get',
})

receipts.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/receipts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipts
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
receipts.url = (options?: RouteQueryOptions) => {
    return receipts.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipts
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
receipts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipts.url(options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipts
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
receipts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: receipts.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipts
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
    const receiptsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: receipts.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipts
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
 */
        receiptsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: receipts.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipts
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts'
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
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipt
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
export const receipt = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})

receipt.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/receipts/{receipt}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipt
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
receipt.url = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { receipt: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    receipt: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        receipt: args.receipt,
                }

    return receipt.definition.url
            .replace('{receipt}', parsedArgs.receipt.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipt
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
receipt.get = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipt
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
receipt.head = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: receipt.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipt
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
    const receiptForm = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: receipt.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipt
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
        receiptForm.get = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: receipt.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::receipt
 * @see [unknown]:0
 * @route '/api/v1/member-portal/receipts/{receipt}'
 */
        receiptForm.head = (args: { receipt: string | number } | [receipt: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: receipt.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    receipt.form = receiptForm
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
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markNotificationRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/read'
 */
export const markNotificationRead = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markNotificationRead.url(args, options),
    method: 'patch',
})

markNotificationRead.definition = {
    methods: ["patch"],
    url: '/api/v1/member-portal/notifications/{notification}/read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markNotificationRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/read'
 */
markNotificationRead.url = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: args.notification,
                }

    return markNotificationRead.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markNotificationRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/read'
 */
markNotificationRead.patch = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markNotificationRead.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markNotificationRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/read'
 */
    const markNotificationReadForm = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markNotificationRead.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markNotificationRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/read'
 */
        markNotificationReadForm.patch = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markNotificationRead.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    markNotificationRead.form = markNotificationReadForm
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markNotificationUnread
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/unread'
 */
export const markNotificationUnread = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markNotificationUnread.url(args, options),
    method: 'patch',
})

markNotificationUnread.definition = {
    methods: ["patch"],
    url: '/api/v1/member-portal/notifications/{notification}/unread',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markNotificationUnread
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/unread'
 */
markNotificationUnread.url = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: args.notification,
                }

    return markNotificationUnread.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markNotificationUnread
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/unread'
 */
markNotificationUnread.patch = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: markNotificationUnread.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markNotificationUnread
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/unread'
 */
    const markNotificationUnreadForm = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markNotificationUnread.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markNotificationUnread
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/{notification}/unread'
 */
        markNotificationUnreadForm.patch = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markNotificationUnread.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    markNotificationUnread.form = markNotificationUnreadForm
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markAllNotificationsRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/mark-all-read'
 */
export const markAllNotificationsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllNotificationsRead.url(options),
    method: 'post',
})

markAllNotificationsRead.definition = {
    methods: ["post"],
    url: '/api/v1/member-portal/notifications/mark-all-read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markAllNotificationsRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/mark-all-read'
 */
markAllNotificationsRead.url = (options?: RouteQueryOptions) => {
    return markAllNotificationsRead.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markAllNotificationsRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/mark-all-read'
 */
markAllNotificationsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllNotificationsRead.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markAllNotificationsRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/mark-all-read'
 */
    const markAllNotificationsReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAllNotificationsRead.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::markAllNotificationsRead
 * @see [unknown]:0
 * @route '/api/v1/member-portal/notifications/mark-all-read'
 */
        markAllNotificationsReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAllNotificationsRead.url(options),
            method: 'post',
        })
    
    markAllNotificationsRead.form = markAllNotificationsReadForm
const MemberPortalController = { dashboard, profile, updateProfile, qrCard, membership, payments, receipts, receipt, attendance, notifications, markNotificationRead, markNotificationUnread, markAllNotificationsRead }

export default MemberPortalController