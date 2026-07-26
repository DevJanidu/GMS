import { FileText, ReceiptText, Wallet } from 'lucide-react';
import type { ModuleNavigation } from '@/types';

export const navigation: ModuleNavigation = {
    title: 'Billing & Payments',
    href: '/billing/invoices',
    icon: ReceiptText,
    order: 40,
    group: 'Finance',
    children: [
        {
            title: 'Invoices',
            href: '/billing/invoices',
            icon: FileText,
            permission: 'billing.invoices.view',
        },
        {
            title: 'Payments',
            href: '/billing/payments',
            icon: Wallet,
            permission: 'billing.payments.view',
        },
    ],
};
