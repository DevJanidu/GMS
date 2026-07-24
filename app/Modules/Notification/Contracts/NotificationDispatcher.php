<?php

namespace App\Modules\Notification\Contracts;

use App\Modules\Notification\DTOs\NotificationEvent;

interface NotificationDispatcher
{
    /** @return list<int> */
    public function dispatchEvent(NotificationEvent $event): array;
}
