<?php

namespace App\Http\Middleware;

use App\Modules\Gym\Models\GymProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'gym' => $this->shareGym($request),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * The current tenant's gym profile, used to brand the sidebar (name,
     * logo, short description) instead of hardcoded product branding.
     *
     * @return array<string, mixed>|null
     */
    protected function shareGym(Request $request): ?array
    {
        $user = $request->user();

        if (! $user) {
            return null;
        }

        $profile = GymProfile::query()->firstWhere('tenant_id', $user->tenant_id);

        return [
            'name' => $profile?->legal_name ?: $user->tenant?->name,
            'description' => $profile?->description,
            'logoUrl' => $profile?->logo_path
                ? Storage::disk('public')->url($profile->logo_path)
                : null,
        ];
    }
}
