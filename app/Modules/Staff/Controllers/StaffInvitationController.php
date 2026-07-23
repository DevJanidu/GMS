<?php

namespace App\Modules\Staff\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Modules\Staff\Requests\AcceptInvitationRequest;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class StaffInvitationController extends Controller
{
    public function show(User $user): JsonResponse
    {
        abort_unless($user->status === 'invited', 404);

        return ApiResponse::success([
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }

    public function accept(AcceptInvitationRequest $request, User $user): JsonResponse
    {
        abort_unless($user->status === 'invited', 404);

        $user->forceFill([
            'password' => $request->string('password')->toString(),
            'status' => 'active',
            'email_verified_at' => now(),
        ])->save();

        $user->staffProfile()->update(['activated_at' => now()]);

        Auth::login($user);

        return ApiResponse::success(null, 'Invitation accepted. You are now signed in.');
    }
}
