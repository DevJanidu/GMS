import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:51
 * @route '/api/v1/member-portal/profile'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/member-portal/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:51
 * @route '/api/v1/member-portal/profile'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:51
 * @route '/api/v1/member-portal/profile'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:51
 * @route '/api/v1/member-portal/profile'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:51
 * @route '/api/v1/member-portal/profile'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:51
 * @route '/api/v1/member-portal/profile'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::show
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:51
 * @route '/api/v1/member-portal/profile'
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
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::update
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:58
 * @route '/api/v1/member-portal/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/member-portal/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::update
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:58
 * @route '/api/v1/member-portal/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::update
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:58
 * @route '/api/v1/member-portal/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::update
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:58
 * @route '/api/v1/member-portal/profile'
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
* @see \App\Modules\MemberPortal\Controllers\MemberPortalController::update
 * @see app/Modules/MemberPortal/Controllers/MemberPortalController.php:58
 * @route '/api/v1/member-portal/profile'
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
const profile = {
    show: Object.assign(show, show),
update: Object.assign(update, update),
}

export default profile