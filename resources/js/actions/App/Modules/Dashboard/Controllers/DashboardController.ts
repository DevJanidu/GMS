import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Modules\Dashboard\Controllers\DashboardController::summary
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard/summary'
 */
export const summary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})

summary.definition = {
    methods: ["get","head"],
    url: '/api/v1/dashboard/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Dashboard\Controllers\DashboardController::summary
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard/summary'
 */
summary.url = (options?: RouteQueryOptions) => {
    return summary.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Dashboard\Controllers\DashboardController::summary
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard/summary'
 */
summary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Dashboard\Controllers\DashboardController::summary
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard/summary'
 */
summary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: summary.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Dashboard\Controllers\DashboardController::summary
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard/summary'
 */
    const summaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: summary.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Dashboard\Controllers\DashboardController::summary
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard/summary'
 */
        summaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Dashboard\Controllers\DashboardController::summary
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:16
 * @route '/api/v1/dashboard/summary'
 */
        summaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: summary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    summary.form = summaryForm
/**
* @see \App\Modules\Dashboard\Controllers\DashboardController::filters
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:25
 * @route '/api/v1/dashboard/filters'
 */
export const filters = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filters.url(options),
    method: 'get',
})

filters.definition = {
    methods: ["get","head"],
    url: '/api/v1/dashboard/filters',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Dashboard\Controllers\DashboardController::filters
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:25
 * @route '/api/v1/dashboard/filters'
 */
filters.url = (options?: RouteQueryOptions) => {
    return filters.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Dashboard\Controllers\DashboardController::filters
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:25
 * @route '/api/v1/dashboard/filters'
 */
filters.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filters.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Dashboard\Controllers\DashboardController::filters
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:25
 * @route '/api/v1/dashboard/filters'
 */
filters.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: filters.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Dashboard\Controllers\DashboardController::filters
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:25
 * @route '/api/v1/dashboard/filters'
 */
    const filtersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: filters.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Dashboard\Controllers\DashboardController::filters
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:25
 * @route '/api/v1/dashboard/filters'
 */
        filtersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filters.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Dashboard\Controllers\DashboardController::filters
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Modules/Dashboard/Controllers/DashboardController.php:25
 * @route '/api/v1/dashboard/filters'
 */
        filtersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filters.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    filters.form = filtersForm
const DashboardController = { summary, filters }

export default DashboardController