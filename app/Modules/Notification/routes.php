<?php

use App\Modules\Notification\Controllers\AnnouncementController;
use App\Modules\Notification\Controllers\NotificationCenterController;
use App\Modules\Notification\Controllers\NotificationDeliveryController;
use App\Modules\Notification\Controllers\NotificationPreferenceController;
use App\Modules\Notification\Controllers\NotificationRuleController;
use App\Modules\Notification\Controllers\NotificationTemplateController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::apiResource('notification-templates', NotificationTemplateController::class)
        ->names('api.notification-templates');
    Route::post('notification-templates/{notificationTemplate}/preview', [NotificationTemplateController::class, 'preview'])
        ->name('api.notification-templates.preview');
    Route::apiResource('notification-rules', NotificationRuleController::class)
        ->names('api.notification-rules');

    Route::get('notification-deliveries', [NotificationDeliveryController::class, 'index'])->name('api.notification-deliveries.index');
    Route::get('notification-deliveries/{notificationDelivery}', [NotificationDeliveryController::class, 'show'])->name('api.notification-deliveries.show');
    Route::post('notification-deliveries/{notificationDelivery}/retry', [NotificationDeliveryController::class, 'retry'])->name('api.notification-deliveries.retry');

    Route::apiResource('announcements', AnnouncementController::class)->names('api.announcements');
    Route::post('announcements/{announcement}/schedule', [AnnouncementController::class, 'schedule'])->name('api.announcements.schedule');
    Route::post('announcements/{announcement}/cancel', [AnnouncementController::class, 'cancel'])->name('api.announcements.cancel');

    Route::get('notifications', [NotificationCenterController::class, 'index'])->name('api.notifications.index');
    Route::get('notifications/unread-count', [NotificationCenterController::class, 'unreadCount'])->name('api.notifications.unread-count');
    Route::patch('notifications/{notification}/read', [NotificationCenterController::class, 'read'])->name('api.notifications.read');
    Route::patch('notifications/{notification}/unread', [NotificationCenterController::class, 'unread'])->name('api.notifications.unread');
    Route::post('notifications/mark-all-read', [NotificationCenterController::class, 'markAllRead'])->name('api.notifications.mark-all-read');

    Route::get('notification-preferences', [NotificationPreferenceController::class, 'show'])->name('api.notification-preferences.show');
    Route::put('notification-preferences', [NotificationPreferenceController::class, 'update'])->name('api.notification-preferences.update');
});
