<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FocusAreaResource;
use App\Http\Resources\GoalResource;
use App\Services\LifeDirectionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LifeDirectionController extends Controller
{
    use ApiResponse;

    public function __construct(private LifeDirectionService $lifeDirectionService) {}

    public function show(Request $request): JsonResponse
    {
        $data = $this->lifeDirectionService->get($request->user());

        return $this->success([
            'vision' => $data['vision'],
            'goals' => GoalResource::collection($data['goals']),
            'focus_areas' => FocusAreaResource::collection($data['focus_areas']),
            'updated_at' => $data['updated_at']?->toIso8601String(),
        ]);
    }

    public function updateVision(Request $request): JsonResponse
    {
        $request->validate([
            'vision' => ['required', 'string'],
        ]);

        $lifeDirection = $this->lifeDirectionService->updateVision(
            $request->user(),
            $request->input('vision')
        );

        return $this->success([
            'vision' => $lifeDirection->vision,
            'updated_at' => $lifeDirection->updated_at->toIso8601String(),
        ]);
    }
}
