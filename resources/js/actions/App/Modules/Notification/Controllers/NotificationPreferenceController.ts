import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::show
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:15
 * @route '/api/v1/notification-preferences'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/notification-preferences',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::show
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:15
 * @route '/api/v1/notification-preferences'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::show
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:15
 * @route '/api/v1/notification-preferences'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::show
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:15
 * @route '/api/v1/notification-preferences'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::show
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:15
 * @route '/api/v1/notification-preferences'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::show
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:15
 * @route '/api/v1/notification-preferences'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::show
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:15
 * @route '/api/v1/notification-preferences'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::update
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:23
 * @route '/api/v1/notification-preferences'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/notification-preferences',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::update
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:23
 * @route '/api/v1/notification-preferences'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::update
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:23
 * @route '/api/v1/notification-preferences'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::update
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:23
 * @route '/api/v1/notification-preferences'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Modules\Notification\Controllers\NotificationPreferenceController::update
 * @see app/Modules/Notification/Controllers/NotificationPreferenceController.php:23
 * @route '/api/v1/notification-preferences'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const NotificationPreferenceController = { show, update }

export default NotificationPreferenceController