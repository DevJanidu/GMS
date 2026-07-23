import { ReceiptText } from 'lucide-react';
import type { NavItem } from '@/types';

export const navigation: NavItem = {
    title: 'Billing',
    href: '/billing/invoices',
    icon: ReceiptText,
};

export const billingNavigation = [
    {
        title: 'Invoices',
        href: '/billing/invoices',
        permission: 'billing.invoices.view',
    },
    {
        title: 'Payments',
        href: '/billing/payments',
        permission: 'billing.payments.view',
    },
    {
        title: 'Outstanding',
        href: '/billing/outstanding',
        permission: 'billing.outstanding.view',
    },
    {
        title: 'Collections',
        href: '/billing/collections',
        permission: 'billing.collections.view',
    },
];
