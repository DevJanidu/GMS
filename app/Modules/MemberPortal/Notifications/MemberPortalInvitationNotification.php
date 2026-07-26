<?php

namespace App\Modules\MemberPortal\Notifications;

use App\Models\Tenant;
use App\Modules\Gym\Models\GymProfile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Throwable;

class MemberPortalInvitationNotification extends Notification implements ShouldQueue
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
            'member-portal.invitations.accept',
            now()->addDays(7),
            ['user' => $notifiable->getKey()],
        );

        $gymProfile = null;

        try {
            $gymProfile = GymProfile::query()->firstWhere('tenant_id', $this->tenant->id);
        } catch (Throwable $e) {
            Log::warning('Unable to resolve gym branding for the invitation email.', ['exception' => $e]);
        }

        $logoPath = $gymProfile?->logo_path && Storage::disk('public')->exists($gymProfile->logo_path)
            ? Storage::disk('public')->path($gymProfile->logo_path)
            : null;

        return (new MailMessage)
            ->subject("You're invited to your {$this->tenant->name} member portal")
            ->view('emails.member-portal-invitation', [
                'gymName' => $gymProfile?->legal_name ?? $this->tenant->name,
                'logoPath' => $logoPath,
                'memberName' => $notifiable->name,
                'url' => $url,
            ]);
    }
}
