<?php

namespace App\Modules\Billing\Models\Concerns;

use LogicException;

trait ImmutableLedgerEntry
{
    protected static function bootImmutableLedgerEntry(): void
    {
        static::updating(fn () => throw new LogicException('Financial ledger entries cannot be changed.'));
        static::deleting(fn () => throw new LogicException('Financial ledger entries cannot be deleted.'));
    }
}
