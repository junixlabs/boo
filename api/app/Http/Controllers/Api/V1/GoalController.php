<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGoalRequest;
use App\Http\Requests\UpdateGoalRequest;
use App\Http\Resources\GoalResource;
use App\Models\Goal;
use App\Services\GoalService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    use ApiResponse;

    public function __construct(private GoalService $goalService) {}

    public function index(Request $request): JsonResponse
    {
        $goals = $this->goalService->list($request->user(), $request->all());

        return $this->success(GoalResource::collection($goals));
    }

    public function store(StoreGoalRequest $request): JsonResponse
    {
        $goal = $this->goalService->create($request->user(), $request->validated());

        return $this->created(new GoalResource($goal));
    }

    public function update(UpdateGoalRequest $request, Goal $goal): JsonResponse
    {
        $this->authorize('update', $goal);

        $goal = $this->goalService->update($goal, $request->validated());

        return $this->success(new GoalResource($goal));
    }

    public function destroy(Request $request, Goal $goal): JsonResponse
    {
        $this->authorize('delete', $goal);

        $this->goalService->delete($goal);

        return $this->noContent();
    }
}
