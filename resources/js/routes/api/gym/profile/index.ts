import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Modules\Gym\Controllers\GymProfileController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:16
 * @route '/api/v1/gym/profile'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/gym/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Gym\Controllers\GymProfileController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:16
 * @route '/api/v1/gym/profile'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Gym\Controllers\GymProfileController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:16
 * @route '/api/v1/gym/profile'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Gym\Controllers\GymProfileController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:16
 * @route '/api/v1/gym/profile'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Gym\Controllers\GymProfileController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:16
 * @route '/api/v1/gym/profile'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Gym\Controllers\GymProfileController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:16
 * @route '/api/v1/gym/profile'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Gym\Controllers\GymProfileController::show
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:16
 * @route '/api/v1/gym/profile'
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
* @see \App\Modules\Gym\Controllers\GymProfileController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:25
 * @route '/api/v1/gym/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/gym/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Modules\Gym\Controllers\GymProfileController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:25
 * @route '/api/v1/gym/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Gym\Controllers\GymProfileController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:25
 * @route '/api/v1/gym/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Modules\Gym\Controllers\GymProfileController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:25
 * @route '/api/v1/gym/profile'
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
* @see \App\Modules\Gym\Controllers\GymProfileController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Gym/Controllers/GymProfileController.php:25
 * @route '/api/v1/gym/profile'
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