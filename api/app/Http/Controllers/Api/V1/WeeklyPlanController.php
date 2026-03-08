<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWeeklyPlanRequest;
use App\Http\Requests\UpdateWeeklyPlanRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\WeeklyPlanResource;
use App\Models\WeeklyPlan;
use App\Services\WeeklyPlanService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeeklyPlanController extends Controller
{
    use ApiResponse;

    public function __construct(private WeeklyPlanService $weeklyPlanService) {}

    public function index(Request $request): JsonResponse
    {
        $result = $this->weeklyPlanService->get($request->user(), $request->all());

        return $this->success([
            'plan' => $result['plan'] ? new WeeklyPlanResource($result['plan']) : null,
            'tasks_completed_this_week' => TaskResource::collection($result['tasks_completed']),
        ]);
    }

    public function store(StoreWeeklyPlanRequest $request): JsonResponse
    {
        $plan = $this->weeklyPlanService->create($request->user(), $request->validated());

        return $this->created(new WeeklyPlanResource($plan));
    }

    public function update(UpdateWeeklyPlanRequest $request, WeeklyPlan $weeklyPlan): JsonResponse
    {
        $this->authorize('update', $weeklyPlan);

        $plan = $this->weeklyPlanService->update($weeklyPlan, $request->validated());

        return $this->success(new WeeklyPlanResource($plan));
    }
}
