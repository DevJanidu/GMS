<?php

namespace App\Modules\Notification\DTOs;

final readonly class RenderedNotification
{
    public function __construct(
        public ?string $subject,
        public string $body,
    ) {}
}
