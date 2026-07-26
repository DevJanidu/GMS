import { lazy } from 'react';
import type { LazyExoticComponent } from 'react';

export type BillingRoute = {
    path: string;
    permission: string;
    component: LazyExoticComponent<React.ComponentType<any>>;
};

export const billingRoutes: BillingRoute[] = [
    {
        path: '/billing/invoices',
        permission: 'billing.invoices.view',
        component: lazy(() => import('./pages/invoice-list-page')),
    },
    {
        path: '/billing/invoices/create',
        permission: 'billing.invoices.create',
        component: lazy(() => import('./pages/create-invoice-page')),
    },
    {
        path: '/billing/invoices/:invoiceId',
        permission: 'billing.invoices.view',
        component: lazy(() => import('./pages/invoice-details-page')),
    },
    {
        path: '/billing/payments',
        permission: 'billing.payments.view',
        component: lazy(() => import('./pages/payment-history-page')),
    },
    {
        path: '/billing/receipts/:receiptId',
        permission: 'billing.receipts.view',
        component: lazy(() => import('./pages/receipt-page')),
    },
    {
        path: '/billing/outstanding',
        permission: 'billing.outstanding.view',
        component: lazy(() => import('./pages/outstanding-balances-page')),
    },
    {
        path: '/billing/collections',
        permission: 'billing.collections.view',
        component: lazy(() => import('./pages/collection-summary-page')),
    },
];
