<?php

namespace App\Modules\Gym\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Gym\Models\GymProfile;
use App\Modules\Gym\Requests\UpdateGymProfileRequest;
use App\Modules\Gym\Resources\GymProfileResource;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $profile->update($request->validated());

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
