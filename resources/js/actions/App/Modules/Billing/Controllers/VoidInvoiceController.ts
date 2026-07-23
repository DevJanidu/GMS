import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../../wayfinder';
/**
 * @see \App\Modules\Billing\Controllers\VoidInvoiceController::__invoke
 * @see app/Modules/Billing/Controllers/VoidInvoiceController.php:18
 * @route '/api/v1/billing/invoices/{invoice}/void'
 */
const VoidInvoiceController = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: VoidInvoiceController.url(args, options),
    method: 'post',
});

VoidInvoiceController.definition = {
    methods: ['post'],
    url: '/api/v1/billing/invoices/{invoice}/void',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Modules\Billing\Controllers\VoidInvoiceController::__invoke
 * @see app/Modules/Billing/Controllers/VoidInvoiceController.php:18
 * @route '/api/v1/billing/invoices/{invoice}/void'
 */
VoidInvoiceController.url = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        invoice:
            typeof args.invoice === 'object' ? args.invoice.id : args.invoice,
    };

    return (
        VoidInvoiceController.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Modules\Billing\Controllers\VoidInvoiceController::__invoke
 * @see app/Modules/Billing/Controllers/VoidInvoiceController.php:18
 * @route '/api/v1/billing/invoices/{invoice}/void'
 */
VoidInvoiceController.post = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: VoidInvoiceController.url(args, options),
    method: 'post',
});

/**
 * @see \App\Modules\Billing\Controllers\VoidInvoiceController::__invoke
 * @see app/Modules/Billing/Controllers/VoidInvoiceController.php:18
 * @route '/api/v1/billing/invoices/{invoice}/void'
 */
const VoidInvoiceControllerForm = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: VoidInvoiceController.url(args, options),
    method: 'post',
});

/**
 * @see \App\Modules\Billing\Controllers\VoidInvoiceController::__invoke
 * @see app/Modules/Billing/Controllers/VoidInvoiceController.php:18
 * @route '/api/v1/billing/invoices/{invoice}/void'
 */
VoidInvoiceControllerForm.post = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: VoidInvoiceController.url(args, options),
    method: 'post',
});

VoidInvoiceController.form = VoidInvoiceControllerForm;
export default VoidInvoiceController;
