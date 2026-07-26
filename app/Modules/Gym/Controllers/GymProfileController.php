<?php

namespace App\Modules\Gym\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Gym\Models\GymProfile;
use App\Modules\Gym\Requests\UpdateGymProfileRequest;
use App\Modules\Gym\Resources\GymProfileResource;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GymProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $this->authorize('gym.view');

        $profile = $this->profileFor($request);

        return ApiResponse::success((new GymProfileResource($profile->load('tenant')))->resolve());
    }

    public function update(UpdateGymProfileRequest $request): JsonResponse
    {
        $profile = $this->profileFor($request);
        $data = collect($request->validated())->except(['logo', 'currency'])->all();

        if ($request->hasFile('logo')) {
            if ($profile->logo_path) {
                Storage::disk('public')->delete($profile->logo_path);
            }

            $data['logo_path'] = $request->file('logo')->store('gym/logos', 'public') ?: null;
        }

        $profile->update($data);

        if ($request->validated('currency')) {
            $profile->tenant?->update(['currency' => $request->validated('currency')]);
        }

        return ApiResponse::success(
            (new GymProfileResource($profile->load('tenant')))->resolve(),
            'Gym settings updated successfully.',
        );
    }

    protected function profileFor(Request $request): GymProfile
    {
        return GymProfile::query()->firstOrCreate(['tenant_id' => $request->user()->tenant_id]);
    }
}
