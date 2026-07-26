import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
const dashboard = {
    operational: Object.assign(operational, operational),
}

export default dashboard