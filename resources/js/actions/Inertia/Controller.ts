import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
const Controller980bb49ee7ae63891f1d891d2fbcf1c9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

Controller980bb49ee7ae63891f1d891d2fbcf1c9.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
Controller980bb49ee7ae63891f1d891d2fbcf1c9.url = (options?: RouteQueryOptions) => {
    return Controller980bb49ee7ae63891f1d891d2fbcf1c9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
Controller980bb49ee7ae63891f1d891d2fbcf1c9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
Controller980bb49ee7ae63891f1d891d2fbcf1c9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
    const Controller980bb49ee7ae63891f1d891d2fbcf1c9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
        Controller980bb49ee7ae63891f1d891d2fbcf1c9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/'
 */
        Controller980bb49ee7ae63891f1d891d2fbcf1c9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller980bb49ee7ae63891f1d891d2fbcf1c9.form = Controller980bb49ee7ae63891f1d891d2fbcf1c9Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
const Controller42a740574ecbfbac32f8cc353fc32db9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

Controller42a740574ecbfbac32f8cc353fc32db9.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
Controller42a740574ecbfbac32f8cc353fc32db9.url = (options?: RouteQueryOptions) => {
    return Controller42a740574ecbfbac32f8cc353fc32db9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
Controller42a740574ecbfbac32f8cc353fc32db9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
Controller42a740574ecbfbac32f8cc353fc32db9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
    const Controller42a740574ecbfbac32f8cc353fc32db9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
        Controller42a740574ecbfbac32f8cc353fc32db9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
        Controller42a740574ecbfbac32f8cc353fc32db9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller42a740574ecbfbac32f8cc353fc32db9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller42a740574ecbfbac32f8cc353fc32db9.form = Controller42a740574ecbfbac32f8cc353fc32db9Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url = (options?: RouteQueryOptions) => {
    return Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
    const Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
        Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/appearance'
 */
        Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllere19ee86e9cf603ce1a59a1ec5d21dec5.form = Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles'
 */
const Controllerbe1fddd12d9a311af0360a2f8bcfa1e2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
    method: 'get',
})

Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.definition = {
    methods: ["get","head"],
    url: '/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles'
 */
Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.url = (options?: RouteQueryOptions) => {
    return Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles'
 */
Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles'
 */
Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles'
 */
    const Controllerbe1fddd12d9a311af0360a2f8bcfa1e2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles'
 */
        Controllerbe1fddd12d9a311af0360a2f8bcfa1e2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles'
 */
        Controllerbe1fddd12d9a311af0360a2f8bcfa1e2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerbe1fddd12d9a311af0360a2f8bcfa1e2.form = Controllerbe1fddd12d9a311af0360a2f8bcfa1e2Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles/create'
 */
const Controller2b043228f76c34a48ff522fa7c5b7bdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2b043228f76c34a48ff522fa7c5b7bdf.url(options),
    method: 'get',
})

Controller2b043228f76c34a48ff522fa7c5b7bdf.definition = {
    methods: ["get","head"],
    url: '/roles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles/create'
 */
Controller2b043228f76c34a48ff522fa7c5b7bdf.url = (options?: RouteQueryOptions) => {
    return Controller2b043228f76c34a48ff522fa7c5b7bdf.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles/create'
 */
Controller2b043228f76c34a48ff522fa7c5b7bdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2b043228f76c34a48ff522fa7c5b7bdf.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles/create'
 */
Controller2b043228f76c34a48ff522fa7c5b7bdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller2b043228f76c34a48ff522fa7c5b7bdf.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles/create'
 */
    const Controller2b043228f76c34a48ff522fa7c5b7bdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller2b043228f76c34a48ff522fa7c5b7bdf.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles/create'
 */
        Controller2b043228f76c34a48ff522fa7c5b7bdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller2b043228f76c34a48ff522fa7c5b7bdf.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/roles/create'
 */
        Controller2b043228f76c34a48ff522fa7c5b7bdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller2b043228f76c34a48ff522fa7c5b7bdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller2b043228f76c34a48ff522fa7c5b7bdf.form = Controller2b043228f76c34a48ff522fa7c5b7bdfForm
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
const Controller91064dd7859b535f70c57dcb832bd1b9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller91064dd7859b535f70c57dcb832bd1b9.url(options),
    method: 'get',
})

Controller91064dd7859b535f70c57dcb832bd1b9.definition = {
    methods: ["get","head"],
    url: '/branches',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
Controller91064dd7859b535f70c57dcb832bd1b9.url = (options?: RouteQueryOptions) => {
    return Controller91064dd7859b535f70c57dcb832bd1b9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
Controller91064dd7859b535f70c57dcb832bd1b9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller91064dd7859b535f70c57dcb832bd1b9.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
Controller91064dd7859b535f70c57dcb832bd1b9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller91064dd7859b535f70c57dcb832bd1b9.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
    const Controller91064dd7859b535f70c57dcb832bd1b9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller91064dd7859b535f70c57dcb832bd1b9.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
        Controller91064dd7859b535f70c57dcb832bd1b9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller91064dd7859b535f70c57dcb832bd1b9.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches'
 */
        Controller91064dd7859b535f70c57dcb832bd1b9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller91064dd7859b535f70c57dcb832bd1b9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller91064dd7859b535f70c57dcb832bd1b9.form = Controller91064dd7859b535f70c57dcb832bd1b9Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
const Controller4b44898bc00cc4909944eef720bbacba = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller4b44898bc00cc4909944eef720bbacba.url(options),
    method: 'get',
})

Controller4b44898bc00cc4909944eef720bbacba.definition = {
    methods: ["get","head"],
    url: '/branches/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
Controller4b44898bc00cc4909944eef720bbacba.url = (options?: RouteQueryOptions) => {
    return Controller4b44898bc00cc4909944eef720bbacba.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
Controller4b44898bc00cc4909944eef720bbacba.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller4b44898bc00cc4909944eef720bbacba.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
Controller4b44898bc00cc4909944eef720bbacba.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller4b44898bc00cc4909944eef720bbacba.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
    const Controller4b44898bc00cc4909944eef720bbacbaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller4b44898bc00cc4909944eef720bbacba.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
        Controller4b44898bc00cc4909944eef720bbacbaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller4b44898bc00cc4909944eef720bbacba.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/branches/create'
 */
        Controller4b44898bc00cc4909944eef720bbacbaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller4b44898bc00cc4909944eef720bbacba.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller4b44898bc00cc4909944eef720bbacba.form = Controller4b44898bc00cc4909944eef720bbacbaForm
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
const Controller71ea59002240111fe17d395213ca949e = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller71ea59002240111fe17d395213ca949e.url(options),
    method: 'get',
})

Controller71ea59002240111fe17d395213ca949e.definition = {
    methods: ["get","head"],
    url: '/settings/gym',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
Controller71ea59002240111fe17d395213ca949e.url = (options?: RouteQueryOptions) => {
    return Controller71ea59002240111fe17d395213ca949e.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
Controller71ea59002240111fe17d395213ca949e.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller71ea59002240111fe17d395213ca949e.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
Controller71ea59002240111fe17d395213ca949e.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller71ea59002240111fe17d395213ca949e.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
    const Controller71ea59002240111fe17d395213ca949eForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller71ea59002240111fe17d395213ca949e.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
        Controller71ea59002240111fe17d395213ca949eForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller71ea59002240111fe17d395213ca949e.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/settings/gym'
 */
        Controller71ea59002240111fe17d395213ca949eForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller71ea59002240111fe17d395213ca949e.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller71ea59002240111fe17d395213ca949e.form = Controller71ea59002240111fe17d395213ca949eForm
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
const Controller329fd943836cf306ed5281162dce3109 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller329fd943836cf306ed5281162dce3109.url(options),
    method: 'get',
})

Controller329fd943836cf306ed5281162dce3109.definition = {
    methods: ["get","head"],
    url: '/staff',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
Controller329fd943836cf306ed5281162dce3109.url = (options?: RouteQueryOptions) => {
    return Controller329fd943836cf306ed5281162dce3109.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
Controller329fd943836cf306ed5281162dce3109.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller329fd943836cf306ed5281162dce3109.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
Controller329fd943836cf306ed5281162dce3109.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller329fd943836cf306ed5281162dce3109.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
    const Controller329fd943836cf306ed5281162dce3109Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller329fd943836cf306ed5281162dce3109.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
        Controller329fd943836cf306ed5281162dce3109Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller329fd943836cf306ed5281162dce3109.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff'
 */
        Controller329fd943836cf306ed5281162dce3109Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller329fd943836cf306ed5281162dce3109.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller329fd943836cf306ed5281162dce3109.form = Controller329fd943836cf306ed5281162dce3109Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
const Controller2774561341a3d0bccd802e7b9052b4bd = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2774561341a3d0bccd802e7b9052b4bd.url(options),
    method: 'get',
})

Controller2774561341a3d0bccd802e7b9052b4bd.definition = {
    methods: ["get","head"],
    url: '/staff/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
Controller2774561341a3d0bccd802e7b9052b4bd.url = (options?: RouteQueryOptions) => {
    return Controller2774561341a3d0bccd802e7b9052b4bd.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
Controller2774561341a3d0bccd802e7b9052b4bd.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller2774561341a3d0bccd802e7b9052b4bd.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
Controller2774561341a3d0bccd802e7b9052b4bd.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller2774561341a3d0bccd802e7b9052b4bd.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
    const Controller2774561341a3d0bccd802e7b9052b4bdForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller2774561341a3d0bccd802e7b9052b4bd.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
        Controller2774561341a3d0bccd802e7b9052b4bdForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller2774561341a3d0bccd802e7b9052b4bd.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/staff/create'
 */
        Controller2774561341a3d0bccd802e7b9052b4bdForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller2774561341a3d0bccd802e7b9052b4bd.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller2774561341a3d0bccd802e7b9052b4bd.form = Controller2774561341a3d0bccd802e7b9052b4bdForm

/**
* Multiple routes resolve to \Inertia\Controller::Controller, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `Controller['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
const Controller = {
    '/': Controller980bb49ee7ae63891f1d891d2fbcf1c9,
    '/dashboard': Controller42a740574ecbfbac32f8cc353fc32db9,
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
    '/roles': Controllerbe1fddd12d9a311af0360a2f8bcfa1e2,
    '/roles/create': Controller2b043228f76c34a48ff522fa7c5b7bdf,
    '/branches': Controller91064dd7859b535f70c57dcb832bd1b9,
    '/branches/create': Controller4b44898bc00cc4909944eef720bbacba,
    '/settings/gym': Controller71ea59002240111fe17d395213ca949e,
    '/staff': Controller329fd943836cf306ed5281162dce3109,
    '/staff/create': Controller2774561341a3d0bccd802e7b9052b4bd,
}

export default Controller