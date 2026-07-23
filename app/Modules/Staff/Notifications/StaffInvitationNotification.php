<?php

namespace App\Modules\Staff\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class StaffInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected Tenant $tenant) {}

    /**
     * @return list<string>
     */
    public function via(mixed $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $url = URL::temporarySignedRoute(
            'staff.invitations.accept',
            now()->addDays(7),
            ['user' => $notifiable->getKey()],
        );

        return (new MailMessage)
            ->subject("You've been invited to join {$this->tenant->name} on Gym Management System")
            ->greeting('Hello '.$notifiable->name.',')
            ->line("You have been invited to join {$this->tenant->name} as a staff member.")
            ->action('Accept invitation', $url)
            ->line('This invitation link expires in 7 days.');
    }
}
