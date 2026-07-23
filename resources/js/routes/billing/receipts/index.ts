import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../wayfinder';
/**
 * @see app/Modules/Billing/web.php:30
 * @route '/billing/receipts/{receiptId}'
 */
export const show = (
    args:
        | { receiptId: string | number }
        | [receiptId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/billing/receipts/{receiptId}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see app/Modules/Billing/web.php:30
 * @route '/billing/receipts/{receiptId}'
 */
show.url = (
    args:
        | { receiptId: string | number }
        | [receiptId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { receiptId: args };
    }

    if (Array.isArray(args)) {
        args = {
            receiptId: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        receiptId: args.receiptId,
    };

    return (
        show.definition.url
            .replace('{receiptId}', parsedArgs.receiptId.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see app/Modules/Billing/web.php:30
 * @route '/billing/receipts/{receiptId}'
 */
show.get = (
    args:
        | { receiptId: string | number }
        | [receiptId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});
/**
 * @see app/Modules/Billing/web.php:30
 * @route '/billing/receipts/{receiptId}'
 */
show.head = (
    args:
        | { receiptId: string | number }
        | [receiptId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see app/Modules/Billing/web.php:30
 * @route '/billing/receipts/{receiptId}'
 */
const showForm = (
    args:
        | { receiptId: string | number }
        | [receiptId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see app/Modules/Billing/web.php:30
 * @route '/billing/receipts/{receiptId}'
 */
showForm.get = (
    args:
        | { receiptId: string | number }
        | [receiptId: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});
/**
 * @see app/Modules/Billing/web.php:30
 * @route '/billing/receipts/{receiptId}'
 */
showForm.head = (
    args:
        | { receiptId: string | number }
        | [receiptId: string | number]
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
const receipts = {
    show: Object.assign(show, show),
};

export default receipts;
