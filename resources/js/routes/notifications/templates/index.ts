import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
 * @see app/Modules/Notification/web.php:8
 * @route '/notifications/templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/notifications/templates',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Notification/web.php:8
 * @route '/notifications/templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see app/Modules/Notification/web.php:8
 * @route '/notifications/templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see app/Modules/Notification/web.php:8
 * @route '/notifications/templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see app/Modules/Notification/web.php:8
 * @route '/notifications/templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see app/Modules/Notification/web.php:8
 * @route '/notifications/templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see app/Modules/Notification/web.php:8
 * @route '/notifications/templates'
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
 * @see app/Modules/Notification/web.php:9
 * @route '/notifications/templates/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/notifications/templates/create',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Notification/web.php:9
 * @route '/notifications/templates/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
 * @see app/Modules/Notification/web.php:9
 * @route '/notifications/templates/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
 * @see app/Modules/Notification/web.php:9
 * @route '/notifications/templates/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
 * @see app/Modules/Notification/web.php:9
 * @route '/notifications/templates/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
 * @see app/Modules/Notification/web.php:9
 * @route '/notifications/templates/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
 * @see app/Modules/Notification/web.php:9
 * @route '/notifications/templates/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
 * @see app/Modules/Notification/web.php:10
 * @route '/notifications/templates/{templateId}/edit'
 */
export const edit = (args: { templateId: string | number } | [templateId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/notifications/templates/{templateId}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Notification/web.php:10
 * @route '/notifications/templates/{templateId}/edit'
 */
edit.url = (args: { templateId: string | number } | [templateId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { templateId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    templateId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        templateId: args.templateId,
                }

    return edit.definition.url
            .replace('{templateId}', parsedArgs.templateId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see app/Modules/Notification/web.php:10
 * @route '/notifications/templates/{templateId}/edit'
 */
edit.get = (args: { templateId: string | number } | [templateId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
 * @see app/Modules/Notification/web.php:10
 * @route '/notifications/templates/{templateId}/edit'
 */
edit.head = (args: { templateId: string | number } | [templateId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
 * @see app/Modules/Notification/web.php:10
 * @route '/notifications/templates/{templateId}/edit'
 */
    const editForm = (args: { templateId: string | number } | [templateId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
 * @see app/Modules/Notification/web.php:10
 * @route '/notifications/templates/{templateId}/edit'
 */
        editForm.get = (args: { templateId: string | number } | [templateId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
 * @see app/Modules/Notification/web.php:10
 * @route '/notifications/templates/{templateId}/edit'
 */
        editForm.head = (args: { templateId: string | number } | [templateId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
const templates = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
edit: Object.assign(edit, edit),
}

export default templates