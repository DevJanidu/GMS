<?php

namespace App\Modules\Notification\Services;

use App\Modules\Notification\Contracts\NotificationTemplateRenderer;
use App\Modules\Notification\DTOs\RenderedNotification;
use App\Modules\Notification\Models\NotificationTemplate;
use Illuminate\Validation\ValidationException;

final class SafeNotificationTemplateRenderer implements NotificationTemplateRenderer
{
    public function render(NotificationTemplate $template, array $variables): RenderedNotification
    {
        $allowed = collect($template->variables ?? [])->map(fn ($value) => (string) $value)->all();
        $unknown = array_diff(array_keys($variables), $allowed);

        if ($unknown !== []) {
            throw ValidationException::withMessages([
                'variables' => ['Unsupported template variables: '.implode(', ', $unknown)],
            ]);
        }

        $render = function (?string $value) use ($variables): ?string {
            if ($value === null) {
                return null;
            }

            return preg_replace_callback(
                '/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/',
                fn (array $match) => e((string) ($variables[$match[1]] ?? '')),
                $value,
            );
        };

        return new RenderedNotification($render($template->subject), (string) $render($template->body));
    }
}
