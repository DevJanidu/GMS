import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
 * @route '/reports'
 */
const Controller58ce3b21459752ee73930d924bf98aec = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller58ce3b21459752ee73930d924bf98aec.url(options),
    method: 'get',
})

Controller58ce3b21459752ee73930d924bf98aec.definition = {
    methods: ["get","head"],
    url: '/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/reports'
 */
Controller58ce3b21459752ee73930d924bf98aec.url = (options?: RouteQueryOptions) => {
    return Controller58ce3b21459752ee73930d924bf98aec.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/reports'
 */
Controller58ce3b21459752ee73930d924bf98aec.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller58ce3b21459752ee73930d924bf98aec.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/reports'
 */
Controller58ce3b21459752ee73930d924bf98aec.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller58ce3b21459752ee73930d924bf98aec.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/reports'
 */
    const Controller58ce3b21459752ee73930d924bf98aecForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller58ce3b21459752ee73930d924bf98aec.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/reports'
 */
        Controller58ce3b21459752ee73930d924bf98aecForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller58ce3b21459752ee73930d924bf98aec.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/reports'
 */
        Controller58ce3b21459752ee73930d924bf98aecForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller58ce3b21459752ee73930d924bf98aec.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller58ce3b21459752ee73930d924bf98aec.form = Controller58ce3b21459752ee73930d924bf98aecForm
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
 * @route '/member-portal'
 */
const Controller1df94407191e17795b7dbc43fbcad1af = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller1df94407191e17795b7dbc43fbcad1af.url(options),
    method: 'get',
})

Controller1df94407191e17795b7dbc43fbcad1af.definition = {
    methods: ["get","head"],
    url: '/member-portal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
Controller1df94407191e17795b7dbc43fbcad1af.url = (options?: RouteQueryOptions) => {
    return Controller1df94407191e17795b7dbc43fbcad1af.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
Controller1df94407191e17795b7dbc43fbcad1af.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller1df94407191e17795b7dbc43fbcad1af.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
Controller1df94407191e17795b7dbc43fbcad1af.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller1df94407191e17795b7dbc43fbcad1af.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
    const Controller1df94407191e17795b7dbc43fbcad1afForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller1df94407191e17795b7dbc43fbcad1af.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
        Controller1df94407191e17795b7dbc43fbcad1afForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller1df94407191e17795b7dbc43fbcad1af.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal'
 */
        Controller1df94407191e17795b7dbc43fbcad1afForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller1df94407191e17795b7dbc43fbcad1af.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller1df94407191e17795b7dbc43fbcad1af.form = Controller1df94407191e17795b7dbc43fbcad1afForm
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
const Controllerabf0892ef3e4814b016733781c8c7874 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerabf0892ef3e4814b016733781c8c7874.url(options),
    method: 'get',
})

Controllerabf0892ef3e4814b016733781c8c7874.definition = {
    methods: ["get","head"],
    url: '/member-portal/qr-card',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
Controllerabf0892ef3e4814b016733781c8c7874.url = (options?: RouteQueryOptions) => {
    return Controllerabf0892ef3e4814b016733781c8c7874.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
Controllerabf0892ef3e4814b016733781c8c7874.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerabf0892ef3e4814b016733781c8c7874.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
Controllerabf0892ef3e4814b016733781c8c7874.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerabf0892ef3e4814b016733781c8c7874.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
    const Controllerabf0892ef3e4814b016733781c8c7874Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerabf0892ef3e4814b016733781c8c7874.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
        Controllerabf0892ef3e4814b016733781c8c7874Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerabf0892ef3e4814b016733781c8c7874.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/qr-card'
 */
        Controllerabf0892ef3e4814b016733781c8c7874Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerabf0892ef3e4814b016733781c8c7874.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerabf0892ef3e4814b016733781c8c7874.form = Controllerabf0892ef3e4814b016733781c8c7874Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
const Controller7b24bc9781d685a9fafac1ed32344ec9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller7b24bc9781d685a9fafac1ed32344ec9.url(options),
    method: 'get',
})

Controller7b24bc9781d685a9fafac1ed32344ec9.definition = {
    methods: ["get","head"],
    url: '/member-portal/membership',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
Controller7b24bc9781d685a9fafac1ed32344ec9.url = (options?: RouteQueryOptions) => {
    return Controller7b24bc9781d685a9fafac1ed32344ec9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
Controller7b24bc9781d685a9fafac1ed32344ec9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller7b24bc9781d685a9fafac1ed32344ec9.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
Controller7b24bc9781d685a9fafac1ed32344ec9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller7b24bc9781d685a9fafac1ed32344ec9.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
    const Controller7b24bc9781d685a9fafac1ed32344ec9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller7b24bc9781d685a9fafac1ed32344ec9.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
        Controller7b24bc9781d685a9fafac1ed32344ec9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller7b24bc9781d685a9fafac1ed32344ec9.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/membership'
 */
        Controller7b24bc9781d685a9fafac1ed32344ec9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller7b24bc9781d685a9fafac1ed32344ec9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller7b24bc9781d685a9fafac1ed32344ec9.form = Controller7b24bc9781d685a9fafac1ed32344ec9Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
const Controllere07362f7803086fe275644a6a1cb50f2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere07362f7803086fe275644a6a1cb50f2.url(options),
    method: 'get',
})

Controllere07362f7803086fe275644a6a1cb50f2.definition = {
    methods: ["get","head"],
    url: '/member-portal/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
Controllere07362f7803086fe275644a6a1cb50f2.url = (options?: RouteQueryOptions) => {
    return Controllere07362f7803086fe275644a6a1cb50f2.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
Controllere07362f7803086fe275644a6a1cb50f2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere07362f7803086fe275644a6a1cb50f2.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
Controllere07362f7803086fe275644a6a1cb50f2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere07362f7803086fe275644a6a1cb50f2.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
    const Controllere07362f7803086fe275644a6a1cb50f2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllere07362f7803086fe275644a6a1cb50f2.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
        Controllere07362f7803086fe275644a6a1cb50f2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllere07362f7803086fe275644a6a1cb50f2.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/payments'
 */
        Controllere07362f7803086fe275644a6a1cb50f2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllere07362f7803086fe275644a6a1cb50f2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllere07362f7803086fe275644a6a1cb50f2.form = Controllere07362f7803086fe275644a6a1cb50f2Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
const Controllerf4f083f97e5f10870e1ee8c33cec1885 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerf4f083f97e5f10870e1ee8c33cec1885.url(options),
    method: 'get',
})

Controllerf4f083f97e5f10870e1ee8c33cec1885.definition = {
    methods: ["get","head"],
    url: '/member-portal/receipts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
Controllerf4f083f97e5f10870e1ee8c33cec1885.url = (options?: RouteQueryOptions) => {
    return Controllerf4f083f97e5f10870e1ee8c33cec1885.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
Controllerf4f083f97e5f10870e1ee8c33cec1885.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerf4f083f97e5f10870e1ee8c33cec1885.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
Controllerf4f083f97e5f10870e1ee8c33cec1885.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerf4f083f97e5f10870e1ee8c33cec1885.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
    const Controllerf4f083f97e5f10870e1ee8c33cec1885Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerf4f083f97e5f10870e1ee8c33cec1885.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
        Controllerf4f083f97e5f10870e1ee8c33cec1885Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerf4f083f97e5f10870e1ee8c33cec1885.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/receipts'
 */
        Controllerf4f083f97e5f10870e1ee8c33cec1885Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerf4f083f97e5f10870e1ee8c33cec1885.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerf4f083f97e5f10870e1ee8c33cec1885.form = Controllerf4f083f97e5f10870e1ee8c33cec1885Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
const Controllerc61b260b012a2e29863862ecb4961d26 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerc61b260b012a2e29863862ecb4961d26.url(options),
    method: 'get',
})

Controllerc61b260b012a2e29863862ecb4961d26.definition = {
    methods: ["get","head"],
    url: '/member-portal/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
Controllerc61b260b012a2e29863862ecb4961d26.url = (options?: RouteQueryOptions) => {
    return Controllerc61b260b012a2e29863862ecb4961d26.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
Controllerc61b260b012a2e29863862ecb4961d26.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerc61b260b012a2e29863862ecb4961d26.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
Controllerc61b260b012a2e29863862ecb4961d26.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerc61b260b012a2e29863862ecb4961d26.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
    const Controllerc61b260b012a2e29863862ecb4961d26Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerc61b260b012a2e29863862ecb4961d26.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
        Controllerc61b260b012a2e29863862ecb4961d26Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerc61b260b012a2e29863862ecb4961d26.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/attendance'
 */
        Controllerc61b260b012a2e29863862ecb4961d26Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerc61b260b012a2e29863862ecb4961d26.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerc61b260b012a2e29863862ecb4961d26.form = Controllerc61b260b012a2e29863862ecb4961d26Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
const Controller03e7681836b6d9188552d5ed3727e35a = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller03e7681836b6d9188552d5ed3727e35a.url(options),
    method: 'get',
})

Controller03e7681836b6d9188552d5ed3727e35a.definition = {
    methods: ["get","head"],
    url: '/member-portal/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
Controller03e7681836b6d9188552d5ed3727e35a.url = (options?: RouteQueryOptions) => {
    return Controller03e7681836b6d9188552d5ed3727e35a.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
Controller03e7681836b6d9188552d5ed3727e35a.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller03e7681836b6d9188552d5ed3727e35a.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
Controller03e7681836b6d9188552d5ed3727e35a.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller03e7681836b6d9188552d5ed3727e35a.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
    const Controller03e7681836b6d9188552d5ed3727e35aForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller03e7681836b6d9188552d5ed3727e35a.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
        Controller03e7681836b6d9188552d5ed3727e35aForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller03e7681836b6d9188552d5ed3727e35a.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/notifications'
 */
        Controller03e7681836b6d9188552d5ed3727e35aForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller03e7681836b6d9188552d5ed3727e35a.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller03e7681836b6d9188552d5ed3727e35a.form = Controller03e7681836b6d9188552d5ed3727e35aForm
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
const Controller8f83cecf547fcb21b325c5341e8888ef = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller8f83cecf547fcb21b325c5341e8888ef.url(options),
    method: 'get',
})

Controller8f83cecf547fcb21b325c5341e8888ef.definition = {
    methods: ["get","head"],
    url: '/member-portal/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
Controller8f83cecf547fcb21b325c5341e8888ef.url = (options?: RouteQueryOptions) => {
    return Controller8f83cecf547fcb21b325c5341e8888ef.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
Controller8f83cecf547fcb21b325c5341e8888ef.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller8f83cecf547fcb21b325c5341e8888ef.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
Controller8f83cecf547fcb21b325c5341e8888ef.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller8f83cecf547fcb21b325c5341e8888ef.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
    const Controller8f83cecf547fcb21b325c5341e8888efForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller8f83cecf547fcb21b325c5341e8888ef.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
        Controller8f83cecf547fcb21b325c5341e8888efForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller8f83cecf547fcb21b325c5341e8888ef.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/member-portal/profile'
 */
        Controller8f83cecf547fcb21b325c5341e8888efForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller8f83cecf547fcb21b325c5341e8888ef.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller8f83cecf547fcb21b325c5341e8888ef.form = Controller8f83cecf547fcb21b325c5341e8888efForm
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
    '/dashboard': Controller42a740574ecbfbac32f8cc353fc32db9,
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
    '/reports': Controller58ce3b21459752ee73930d924bf98aec,
    '/roles': Controllerbe1fddd12d9a311af0360a2f8bcfa1e2,
    '/roles/create': Controller2b043228f76c34a48ff522fa7c5b7bdf,
    '/branches': Controller91064dd7859b535f70c57dcb832bd1b9,
    '/branches/create': Controller4b44898bc00cc4909944eef720bbacba,
    '/member-portal': Controller1df94407191e17795b7dbc43fbcad1af,
    '/member-portal/qr-card': Controllerabf0892ef3e4814b016733781c8c7874,
    '/member-portal/membership': Controller7b24bc9781d685a9fafac1ed32344ec9,
    '/member-portal/payments': Controllere07362f7803086fe275644a6a1cb50f2,
    '/member-portal/receipts': Controllerf4f083f97e5f10870e1ee8c33cec1885,
    '/member-portal/attendance': Controllerc61b260b012a2e29863862ecb4961d26,
    '/member-portal/notifications': Controller03e7681836b6d9188552d5ed3727e35a,
    '/member-portal/profile': Controller8f83cecf547fcb21b325c5341e8888ef,
    '/staff': Controller329fd943836cf306ed5281162dce3109,
    '/staff/create': Controller2774561341a3d0bccd802e7b9052b4bd,
}

export default Controller