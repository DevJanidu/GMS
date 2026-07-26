import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Report\Controllers\ReportController::catalogue
 * @see app/Modules/Report/Controllers/ReportController.php:18
 * @route '/api/v1/reports/catalogue'
 */
export const catalogue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalogue.url(options),
    method: 'get',
})

catalogue.definition = {
    methods: ["get","head"],
    url: '/api/v1/reports/catalogue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Report\Controllers\ReportController::catalogue
 * @see app/Modules/Report/Controllers/ReportController.php:18
 * @route '/api/v1/reports/catalogue'
 */
catalogue.url = (options?: RouteQueryOptions) => {
    return catalogue.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Report\Controllers\ReportController::catalogue
 * @see app/Modules/Report/Controllers/ReportController.php:18
 * @route '/api/v1/reports/catalogue'
 */
catalogue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalogue.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Report\Controllers\ReportController::catalogue
 * @see app/Modules/Report/Controllers/ReportController.php:18
 * @route '/api/v1/reports/catalogue'
 */
catalogue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: catalogue.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Report\Controllers\ReportController::catalogue
 * @see app/Modules/Report/Controllers/ReportController.php:18
 * @route '/api/v1/reports/catalogue'
 */
    const catalogueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: catalogue.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Report\Controllers\ReportController::catalogue
 * @see app/Modules/Report/Controllers/ReportController.php:18
 * @route '/api/v1/reports/catalogue'
 */
        catalogueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalogue.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Report\Controllers\ReportController::catalogue
 * @see app/Modules/Report/Controllers/ReportController.php:18
 * @route '/api/v1/reports/catalogue'
 */
        catalogueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalogue.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    catalogue.form = catalogueForm
/**
* @see \App\Modules\Report\Controllers\ReportController::operational
 * @see app/Modules/Report/Controllers/ReportController.php:46
 * @route '/api/v1/reports/dashboard/operational'
 */
export const operational = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: operational.url(options),
    method: 'get',
})

operational.definition = {
    methods: ["get","head"],
    url: '/api/v1/reports/dashboard/operational',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Report\Controllers\ReportController::operational
 * @see app/Modules/Report/Controllers/ReportController.php:46
 * @route '/api/v1/reports/dashboard/operational'
 */
operational.url = (options?: RouteQueryOptions) => {
    return operational.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Report\Controllers\ReportController::operational
 * @see app/Modules/Report/Controllers/ReportController.php:46
 * @route '/api/v1/reports/dashboard/operational'
 */
operational.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: operational.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Report\Controllers\ReportController::operational
 * @see app/Modules/Report/Controllers/ReportController.php:46
 * @route '/api/v1/reports/dashboard/operational'
 */
operational.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: operational.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Report\Controllers\ReportController::operational
 * @see app/Modules/Report/Controllers/ReportController.php:46
 * @route '/api/v1/reports/dashboard/operational'
 */
    const operationalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: operational.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Report\Controllers\ReportController::operational
 * @see app/Modules/Report/Controllers/ReportController.php:46
 * @route '/api/v1/reports/dashboard/operational'
 */
        operationalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: operational.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Report\Controllers\ReportController::operational
 * @see app/Modules/Report/Controllers/ReportController.php:46
 * @route '/api/v1/reports/dashboard/operational'
 */
        operationalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: operational.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    operational.form = operationalForm
/**
* @see \App\Modules\Report\Controllers\ReportController::print
 * @see app/Modules/Report/Controllers/ReportController.php:36
 * @route '/api/v1/reports/{reportKey}/print'
 */
export const print = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/api/v1/reports/{reportKey}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Report\Controllers\ReportController::print
 * @see app/Modules/Report/Controllers/ReportController.php:36
 * @route '/api/v1/reports/{reportKey}/print'
 */
print.url = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reportKey: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reportKey: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reportKey: args.reportKey,
                }

    return print.definition.url
            .replace('{reportKey}', parsedArgs.reportKey.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Report\Controllers\ReportController::print
 * @see app/Modules/Report/Controllers/ReportController.php:36
 * @route '/api/v1/reports/{reportKey}/print'
 */
print.get = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Report\Controllers\ReportController::print
 * @see app/Modules/Report/Controllers/ReportController.php:36
 * @route '/api/v1/reports/{reportKey}/print'
 */
print.head = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Report\Controllers\ReportController::print
 * @see app/Modules/Report/Controllers/ReportController.php:36
 * @route '/api/v1/reports/{reportKey}/print'
 */
    const printForm = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: print.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Report\Controllers\ReportController::print
 * @see app/Modules/Report/Controllers/ReportController.php:36
 * @route '/api/v1/reports/{reportKey}/print'
 */
        printForm.get = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Report\Controllers\ReportController::print
 * @see app/Modules/Report/Controllers/ReportController.php:36
 * @route '/api/v1/reports/{reportKey}/print'
 */
        printForm.head = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    print.form = printForm
/**
* @see \App\Modules\Report\Controllers\ReportController::show
 * @see app/Modules/Report/Controllers/ReportController.php:28
 * @route '/api/v1/reports/{reportKey}'
 */
export const show = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/reports/{reportKey}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Report\Controllers\ReportController::show
 * @see app/Modules/Report/Controllers/ReportController.php:28
 * @route '/api/v1/reports/{reportKey}'
 */
show.url = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reportKey: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reportKey: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reportKey: args.reportKey,
                }

    return show.definition.url
            .replace('{reportKey}', parsedArgs.reportKey.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Report\Controllers\ReportController::show
 * @see app/Modules/Report/Controllers/ReportController.php:28
 * @route '/api/v1/reports/{reportKey}'
 */
show.get = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Report\Controllers\ReportController::show
 * @see app/Modules/Report/Controllers/ReportController.php:28
 * @route '/api/v1/reports/{reportKey}'
 */
show.head = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Report\Controllers\ReportController::show
 * @see app/Modules/Report/Controllers/ReportController.php:28
 * @route '/api/v1/reports/{reportKey}'
 */
    const showForm = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Report\Controllers\ReportController::show
 * @see app/Modules/Report/Controllers/ReportController.php:28
 * @route '/api/v1/reports/{reportKey}'
 */
        showForm.get = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Report\Controllers\ReportController::show
 * @see app/Modules/Report/Controllers/ReportController.php:28
 * @route '/api/v1/reports/{reportKey}'
 */
        showForm.head = (args: { reportKey: string | number } | [reportKey: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const ReportController = { catalogue, operational, print, show }

export default ReportController