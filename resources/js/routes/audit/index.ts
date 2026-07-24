import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
 * @see app/Modules/Audit/web.php:7
 * @route '/audit'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/audit',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Audit/web.php:7
 * @route '/audit'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see app/Modules/Audit/web.php:7
 * @route '/audit'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see app/Modules/Audit/web.php:7
 * @route '/audit'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see app/Modules/Audit/web.php:7
 * @route '/audit'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see app/Modules/Audit/web.php:7
 * @route '/audit'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see app/Modules/Audit/web.php:7
 * @route '/audit'
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
 * @see app/Modules/Audit/web.php:8
 * @route '/audit/{auditLogId}'
 */
export const show = (args: { auditLogId: string | number } | [auditLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/audit/{auditLogId}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Audit/web.php:8
 * @route '/audit/{auditLogId}'
 */
show.url = (args: { auditLogId: string | number } | [auditLogId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditLogId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    auditLogId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        auditLogId: args.auditLogId,
                }

    return show.definition.url
            .replace('{auditLogId}', parsedArgs.auditLogId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see app/Modules/Audit/web.php:8
 * @route '/audit/{auditLogId}'
 */
show.get = (args: { auditLogId: string | number } | [auditLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
 * @see app/Modules/Audit/web.php:8
 * @route '/audit/{auditLogId}'
 */
show.head = (args: { auditLogId: string | number } | [auditLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
 * @see app/Modules/Audit/web.php:8
 * @route '/audit/{auditLogId}'
 */
    const showForm = (args: { auditLogId: string | number } | [auditLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
 * @see app/Modules/Audit/web.php:8
 * @route '/audit/{auditLogId}'
 */
        showForm.get = (args: { auditLogId: string | number } | [auditLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
 * @see app/Modules/Audit/web.php:8
 * @route '/audit/{auditLogId}'
 */
        showForm.head = (args: { auditLogId: string | number } | [auditLogId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const audit = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default audit