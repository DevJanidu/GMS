import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
export const gym = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gym.url(options),
    method: 'get',
})

gym.definition = {
    methods: ["get","head"],
    url: '/settings/gym',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
gym.url = (options?: RouteQueryOptions) => {
    return gym.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
gym.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gym.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
gym.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: gym.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
    const gymForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: gym.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
        gymForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: gym.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
        gymForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: gym.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    gym.form = gymForm
const settings = {
    gym: Object.assign(gym, gym),
}

export default settings