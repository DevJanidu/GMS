import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/notifications'
 */
export const center = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: center.url(options),
    method: 'get',
})

center.definition = {
    methods: ["get","head"],
    url: '/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/notifications'
 */
center.url = (options?: RouteQueryOptions) => {
    return center.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/notifications'
 */
center.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: center.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/notifications'
 */
center.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: center.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/notifications'
 */
    const centerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: center.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/notifications'
 */
        centerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: center.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see F:/2026/projects/gym-management-system/GMSv1/vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/notifications'
 */
        centerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: center.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    center.form = centerForm
const notifications = {
    center: Object.assign(center, center),
}

export default notifications