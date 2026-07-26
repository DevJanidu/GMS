import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Modules\Report\Controllers\ReportExportController::store
 * @see app/Modules/Report/Controllers/ReportExportController.php:35
 * @route '/api/v1/report-exports'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/report-exports',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Report\Controllers\ReportExportController::store
 * @see app/Modules/Report/Controllers/ReportExportController.php:35
 * @route '/api/v1/report-exports'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Report\Controllers\ReportExportController::store
 * @see app/Modules/Report/Controllers/ReportExportController.php:35
 * @route '/api/v1/report-exports'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Report\Controllers\ReportExportController::store
 * @see app/Modules/Report/Controllers/ReportExportController.php:35
 * @route '/api/v1/report-exports'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Report\Controllers\ReportExportController::store
 * @see app/Modules/Report/Controllers/ReportExportController.php:35
 * @route '/api/v1/report-exports'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Modules\Report\Controllers\ReportExportController::index
 * @see app/Modules/Report/Controllers/ReportExportController.php:25
 * @route '/api/v1/report-exports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/report-exports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Report\Controllers\ReportExportController::index
 * @see app/Modules/Report/Controllers/ReportExportController.php:25
 * @route '/api/v1/report-exports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Report\Controllers\ReportExportController::index
 * @see app/Modules/Report/Controllers/ReportExportController.php:25
 * @route '/api/v1/report-exports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Report\Controllers\ReportExportController::index
 * @see app/Modules/Report/Controllers/ReportExportController.php:25
 * @route '/api/v1/report-exports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Report\Controllers\ReportExportController::index
 * @see app/Modules/Report/Controllers/ReportExportController.php:25
 * @route '/api/v1/report-exports'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Report\Controllers\ReportExportController::index
 * @see app/Modules/Report/Controllers/ReportExportController.php:25
 * @route '/api/v1/report-exports'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Report\Controllers\ReportExportController::index
 * @see app/Modules/Report/Controllers/ReportExportController.php:25
 * @route '/api/v1/report-exports'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Modules\Report\Controllers\ReportExportController::show
 * @see app/Modules/Report/Controllers/ReportExportController.php:74
 * @route '/api/v1/report-exports/{reportExport}'
 */
export const show = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/report-exports/{reportExport}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Report\Controllers\ReportExportController::show
 * @see app/Modules/Report/Controllers/ReportExportController.php:74
 * @route '/api/v1/report-exports/{reportExport}'
 */
show.url = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reportExport: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reportExport: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reportExport: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reportExport: typeof args.reportExport === 'object'
                ? args.reportExport.id
                : args.reportExport,
                }

    return show.definition.url
            .replace('{reportExport}', parsedArgs.reportExport.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Report\Controllers\ReportExportController::show
 * @see app/Modules/Report/Controllers/ReportExportController.php:74
 * @route '/api/v1/report-exports/{reportExport}'
 */
show.get = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Report\Controllers\ReportExportController::show
 * @see app/Modules/Report/Controllers/ReportExportController.php:74
 * @route '/api/v1/report-exports/{reportExport}'
 */
show.head = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Report\Controllers\ReportExportController::show
 * @see app/Modules/Report/Controllers/ReportExportController.php:74
 * @route '/api/v1/report-exports/{reportExport}'
 */
    const showForm = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Report\Controllers\ReportExportController::show
 * @see app/Modules/Report/Controllers/ReportExportController.php:74
 * @route '/api/v1/report-exports/{reportExport}'
 */
        showForm.get = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Report\Controllers\ReportExportController::show
 * @see app/Modules/Report/Controllers/ReportExportController.php:74
 * @route '/api/v1/report-exports/{reportExport}'
 */
        showForm.head = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Modules\Report\Controllers\ReportExportController::download
 * @see app/Modules/Report/Controllers/ReportExportController.php:81
 * @route '/api/v1/report-exports/{reportExport}/download'
 */
export const download = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/v1/report-exports/{reportExport}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Report\Controllers\ReportExportController::download
 * @see app/Modules/Report/Controllers/ReportExportController.php:81
 * @route '/api/v1/report-exports/{reportExport}/download'
 */
download.url = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reportExport: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reportExport: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reportExport: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reportExport: typeof args.reportExport === 'object'
                ? args.reportExport.id
                : args.reportExport,
                }

    return download.definition.url
            .replace('{reportExport}', parsedArgs.reportExport.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Report\Controllers\ReportExportController::download
 * @see app/Modules/Report/Controllers/ReportExportController.php:81
 * @route '/api/v1/report-exports/{reportExport}/download'
 */
download.get = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Report\Controllers\ReportExportController::download
 * @see app/Modules/Report/Controllers/ReportExportController.php:81
 * @route '/api/v1/report-exports/{reportExport}/download'
 */
download.head = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Report\Controllers\ReportExportController::download
 * @see app/Modules/Report/Controllers/ReportExportController.php:81
 * @route '/api/v1/report-exports/{reportExport}/download'
 */
    const downloadForm = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Report\Controllers\ReportExportController::download
 * @see app/Modules/Report/Controllers/ReportExportController.php:81
 * @route '/api/v1/report-exports/{reportExport}/download'
 */
        downloadForm.get = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Report\Controllers\ReportExportController::download
 * @see app/Modules/Report/Controllers/ReportExportController.php:81
 * @route '/api/v1/report-exports/{reportExport}/download'
 */
        downloadForm.head = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Modules\Report\Controllers\ReportExportController::retry
 * @see app/Modules/Report/Controllers/ReportExportController.php:96
 * @route '/api/v1/report-exports/{reportExport}/retry'
 */
export const retry = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/api/v1/report-exports/{reportExport}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Report\Controllers\ReportExportController::retry
 * @see app/Modules/Report/Controllers/ReportExportController.php:96
 * @route '/api/v1/report-exports/{reportExport}/retry'
 */
retry.url = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reportExport: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reportExport: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reportExport: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reportExport: typeof args.reportExport === 'object'
                ? args.reportExport.id
                : args.reportExport,
                }

    return retry.definition.url
            .replace('{reportExport}', parsedArgs.reportExport.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Report\Controllers\ReportExportController::retry
 * @see app/Modules/Report/Controllers/ReportExportController.php:96
 * @route '/api/v1/report-exports/{reportExport}/retry'
 */
retry.post = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

    /**
* @see \App\Modules\Report\Controllers\ReportExportController::retry
 * @see app/Modules/Report/Controllers/ReportExportController.php:96
 * @route '/api/v1/report-exports/{reportExport}/retry'
 */
    const retryForm = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retry.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Modules\Report\Controllers\ReportExportController::retry
 * @see app/Modules/Report/Controllers/ReportExportController.php:96
 * @route '/api/v1/report-exports/{reportExport}/retry'
 */
        retryForm.post = (args: { reportExport: string | { id: string } } | [reportExport: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retry.url(args, options),
            method: 'post',
        })
    
    retry.form = retryForm
const reportExports = {
    store: Object.assign(store, store),
index: Object.assign(index, index),
show: Object.assign(show, show),
download: Object.assign(download, download),
retry: Object.assign(retry, retry),
}

export default reportExports