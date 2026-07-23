import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../wayfinder';
/**
 * @see app/Modules/Billing/web.php:11
 * @route '/billing/invoices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/billing/invoices',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see app/Modules/Billing/web.php:11
 * @route '/billing/invoices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see app/Modules/Billing/web.php:11
 * @route '/billing/invoices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see app/Modules/Billing/web.php:11
 * @route '/billing/invoices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see app/Modules/Billing/web.php:11
 * @route '/billing/invoices'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see app/Modules/Billing/web.php:11
 * @route '/billing/invoices'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see app/Modules/Billing/web.php:11
 * @route '/billing/invoices'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index.form = indexForm;
/**
 * @see app/Modules/Billing/web.php:14
 * @route '/billing/invoices/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/billing/invoices/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see app/Modules/Billing/web.php:14
 * @route '/billing/invoices/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see app/Modules/Billing/web.php:14
 * @route '/billing/invoices/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});
/**
 * @see app/Modules/Billing/web.php:14
 * @route '/billing/invoices/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see app/Modules/Billing/web.php:14
 * @route '/billing/invoices/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see app/Modules/Billing/web.php:14
 * @route '/billing/invoices/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});
/**
 * @see app/Modules/Billing/web.php:14
 * @route '/billing/invoices/create'
 */
createForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

create.form = createForm;
/**
 * @see app/Modules/Billing/web.php:22
 * @route '/billing/invoices/{invoiceId}'
 */
export const show = (
    args:
        | { invoiceId: string | number }
        | [invoiceId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/billing/invoices/{invoiceId}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see app/Modules/Billing/web.php:22
 * @route '/billing/invoices/{invoiceId}'
 */
show.url = (
    args:
        | { invoiceId: string | number }
        | [invoiceId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoiceId: args };
    }

    if (Array.isArray(args)) {
        args = {
            invoiceId: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        invoiceId: args.invoiceId,
    };

    return (
        show.definition.url
            .replace('{invoiceId}', parsedArgs.invoiceId.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see app/Modules/Billing/web.php:22
 * @route '/billing/invoices/{invoiceId}'
 */
show.get = (
    args:
        | { invoiceId: string | number }
        | [invoiceId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});
/**
 * @see app/Modules/Billing/web.php:22
 * @route '/billing/invoices/{invoiceId}'
 */
show.head = (
    args:
        | { invoiceId: string | number }
        | [invoiceId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see app/Modules/Billing/web.php:22
 * @route '/billing/invoices/{invoiceId}'
 */
const showForm = (
    args:
        | { invoiceId: string | number }
        | [invoiceId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see app/Modules/Billing/web.php:22
 * @route '/billing/invoices/{invoiceId}'
 */
showForm.get = (
    args:
        | { invoiceId: string | number }
        | [invoiceId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});
/**
 * @see app/Modules/Billing/web.php:22
 * @route '/billing/invoices/{invoiceId}'
 */
showForm.head = (
    args:
        | { invoiceId: string | number }
        | [invoiceId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

show.form = showForm;
const invoices = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    show: Object.assign(show, show),
};

export default invoices;
