import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MemberDocumentController::store
 * @see app/Http/Controllers/MemberDocumentController.php:13
 * @route '/members/{member}/documents'
 */
export const store = (args: { member: string | number | { id: string | number } } | [member: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/members/{member}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MemberDocumentController::store
 * @see app/Http/Controllers/MemberDocumentController.php:13
 * @route '/members/{member}/documents'
 */
store.url = (args: { member: string | number | { id: string | number } } | [member: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { member: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                }

    return store.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberDocumentController::store
 * @see app/Http/Controllers/MemberDocumentController.php:13
 * @route '/members/{member}/documents'
 */
store.post = (args: { member: string | number | { id: string | number } } | [member: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MemberDocumentController::store
 * @see app/Http/Controllers/MemberDocumentController.php:13
 * @route '/members/{member}/documents'
 */
    const storeForm = (args: { member: string | number | { id: string | number } } | [member: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MemberDocumentController::store
 * @see app/Http/Controllers/MemberDocumentController.php:13
 * @route '/members/{member}/documents'
 */
        storeForm.post = (args: { member: string | number | { id: string | number } } | [member: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\MemberDocumentController::destroy
 * @see app/Http/Controllers/MemberDocumentController.php:31
 * @route '/members/{member}/documents/{document}'
 */
export const destroy = (args: { member: string | number | { id: string | number }, document: string | number | { id: string | number } } | [member: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/members/{member}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MemberDocumentController::destroy
 * @see app/Http/Controllers/MemberDocumentController.php:31
 * @route '/members/{member}/documents/{document}'
 */
destroy.url = (args: { member: string | number | { id: string | number }, document: string | number | { id: string | number } } | [member: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    member: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroy.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemberDocumentController::destroy
 * @see app/Http/Controllers/MemberDocumentController.php:31
 * @route '/members/{member}/documents/{document}'
 */
destroy.delete = (args: { member: string | number | { id: string | number }, document: string | number | { id: string | number } } | [member: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\MemberDocumentController::destroy
 * @see app/Http/Controllers/MemberDocumentController.php:31
 * @route '/members/{member}/documents/{document}'
 */
    const destroyForm = (args: { member: string | number | { id: string | number }, document: string | number | { id: string | number } } | [member: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MemberDocumentController::destroy
 * @see app/Http/Controllers/MemberDocumentController.php:31
 * @route '/members/{member}/documents/{document}'
 */
        destroyForm.delete = (args: { member: string | number | { id: string | number }, document: string | number | { id: string | number } } | [member: string | number | { id: string | number }, document: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const documents = {
    store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default documents