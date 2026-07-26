<?php

namespace App\Modules\Notification\Providers;

use App\Modules\Billing\Events\BillingEventPublished;
use App\Modules\Membership\Events\MembershipActivated;
use App\Modules\Membership\Events\MembershipExpired;
use App\Modules\Membership\Events\MembershipExpiring;
use App\Modules\Membership\Events\MembershipRenewed;
use App\Modules\Notification\Contracts\NotificationDispatcher;
use App\Modules\Notification\Contracts\NotificationTemplateRenderer;
use App\Modules\Notification\Listeners\BillingNotificationListener;
use App\Modules\Notification\Listeners\MembershipNotificationListener;
use App\Modules\Notification\Listeners\ScalarDomainNotificationListener;
use App\Modules\Notification\Services\DatabaseNotificationDispatcher;
use App\Modules\Notification\Services\SafeNotificationTemplateRenderer;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class NotificationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(NotificationDispatcher::class, DatabaseNotificationDispatcher::class);
        $this->app->bind(NotificationTemplateRenderer::class, SafeNotificationTemplateRenderer::class);
    }

    public function boot(): void
    {
        foreach ([MembershipActivated::class, MembershipExpiring::class, MembershipExpired::class, MembershipRenewed::class] as $event) {
            Event::listen($event, [MembershipNotificationListener::class, 'handle']);
        }
        Event::listen(BillingEventPublished::class, [BillingNotificationListener::class, 'handle']);
        foreach ([
            'App\\Events\\MemberRegistered',
            'App\\Modules\\Attendance\\Events\\AttendanceCheckedIn',
            'App\\Modules\\Attendance\\Events\\AttendanceRejected',
        ] as $event) {
            Event::listen($event, [ScalarDomainNotificationListener::class, 'handle']);
        }
        foreach ([
            'App\\Modules\\Billing\\Events\\PaymentCompleted',
            'App\\Modules\\Billing\\Events\\PaymentRefunded',
        ] as $event) {
            Event::listen($event, [BillingNotificationListener::class, 'handle']);
        }
    }
}
