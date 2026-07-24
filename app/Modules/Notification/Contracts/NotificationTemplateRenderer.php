<?php

namespace App\Modules\Notification\Contracts;

use App\Modules\Notification\DTOs\RenderedNotification;
use App\Modules\Notification\Models\NotificationTemplate;

interface NotificationTemplateRenderer
{
    /**
     * @param  array<string, scalar|null>  $variables
     */
    public function render(NotificationTemplate $template, array $variables): RenderedNotification;
}
