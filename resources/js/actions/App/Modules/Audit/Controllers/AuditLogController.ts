import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Modules\Audit\Controllers\AuditLogController::index
 * @see app/Modules/Audit/Controllers/AuditLogController.php:18
 * @route '/api/v1/audit-logs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/audit-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Audit\Controllers\AuditLogController::index
 * @see app/Modules/Audit/Controllers/AuditLogController.php:18
 * @route '/api/v1/audit-logs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Audit\Controllers\AuditLogController::index
 * @see app/Modules/Audit/Controllers/AuditLogController.php:18
 * @route '/api/v1/audit-logs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Modules\Audit\Controllers\AuditLogController::index
 * @see app/Modules/Audit/Controllers/AuditLogController.php:18
 * @route '/api/v1/audit-logs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Modules\Audit\Controllers\AuditLogController::index
 * @see app/Modules/Audit/Controllers/AuditLogController.php:18
 * @route '/api/v1/audit-logs'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Modules\Audit\Controllers\AuditLogController::index
 * @see app/Modules/Audit/Controllers/AuditLogController.php:18
 * @route '/api/v1/audit-logs'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Modules\Audit\Controllers\AuditLogController::index
 * @see app/Modules/Audit/Controllers/AuditLogController.php:18
 * @route '/api/v1/audit-logs'
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
* @see \App\Modules\Audit\Controllers\AuditLogController::exportMethod
 * @see app/Modules/Audit/Controllers/AuditLogController.php:56
 * @route '/api/v1/audit-logs/exports'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

exportMethod.definition = {
    methods: ["post"],
    url: '/api/v1/audit-logs/exports',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Modules\Audit\Controllers\AuditLogController::exportMethod
 * @see app/Modules/Audit/Controllers/AuditLogController.php:56
 * @route '/api/v1/audit-logs/exports'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Modules\Audit\Controllers\AuditLogController::exportMethod
 * @see app/Modules/Audit/Controllers/AuditLogController.php:56
 * @route '/api/v1/audit-logs/exports'
 */
exportMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exportMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Modules\Audit\Controllers\AuditLogController::exportMethod
 * @see app/Modules/Audit/Controllers/AuditLogController.php:56
 * @route '/api/v1/audit-logs/exports'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: exportMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Modules\Audit\Controllers\AuditLogController::exportMethod
 * @see app/Modules/Audit/Controllers/AuditLogController.php:56
 * @route '/api/v1/audit-logs/exports'
 */
        exportMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: exportMethod.url(options),
            method: 'post',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Modules\Audit\Controllers\AuditLogController::show
 * @see app/Modules/Audit/Controllers/AuditLogController.php:48
 * @route '/api/v1/audit-logs/{auditLog}'
 */
export const show = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/audit-logs/{auditLog}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Modules\Audit\Controllers\AuditLogController::show
 * @see app/Modules/Audit/Controllers/AuditLogController.php:48
 * @route '/api/v1/audit-logs/{auditLog}'
 */
show.url = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditLog: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { auditLog: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    auditLog: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        auditLog: typeof args.auditLog === 'object'
                ? args.auditLog.id
                : args.auditLog,
                }

    return show.definition.url
            .replace('{auditLog}', parsedArgs.auditLog.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Modules\Audit\Controllers\AuditLogController::show
 * @see app/Modules/Audit/Controllers/AuditLogController.php:48
 * @route '/api/v1/audit-logs/{auditLog}'
 */
show.get = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Modules\Audit\Controllers\AuditLogController::show
 * @see app/Modules/Audit/Controllers/AuditLogController.php:48
 * @route '/api/v1/audit-logs/{auditLog}'
 */
show.head = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Modules\Audit\Controllers\AuditLogController::show
 * @see app/Modules/Audit/Controllers/AuditLogController.php:48
 * @route '/api/v1/audit-logs/{auditLog}'
 */
    const showForm = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Modules\Audit\Controllers\AuditLogController::show
 * @see app/Modules/Audit/Controllers/AuditLogController.php:48
 * @route '/api/v1/audit-logs/{auditLog}'
 */
        showForm.get = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Modules\Audit\Controllers\AuditLogController::show
 * @see app/Modules/Audit/Controllers/AuditLogController.php:48
 * @route '/api/v1/audit-logs/{auditLog}'
 */
        showForm.head = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const AuditLogController = { index, exportMethod, show, export: exportMethod }

export default AuditLogController