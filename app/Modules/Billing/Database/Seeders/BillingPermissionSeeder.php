<?php

namespace App\Modules\Billing\Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class BillingPermissionSeeder extends Seeder
{
    public const PERMISSIONS = [
        'billing.invoices.view' => 'View invoices',
        'billing.invoices.create' => 'Create invoices',
        'billing.invoices.void' => 'Void invoices',
        'billing.payments.view' => 'View payment history',
        'billing.payments.record' => 'Record payments',
        'billing.receipts.view' => 'View and print receipts',
        'billing.refunds.view' => 'View refunds',
        'billing.refunds.create' => 'Process refunds',
        'billing.outstanding.view' => 'View outstanding balances',
        'billing.collections.view' => 'View collection summaries',
    ];

    public function run(): void
    {
        foreach (self::PERMISSIONS as $slug => $name) {
            Permission::query()->updateOrCreate(['slug' => $slug], ['name' => $name]);
        }
    }
}
