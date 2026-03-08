<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLearningTaskRequest;
use App\Http\Requests\UpdateLearningTaskRequest;
use App\Http\Requests\UpdateLearningTaskStatusRequest;
use App\Http\Resources\LearningTaskResource;
use App\Models\LearningTask;
use App\Models\Skill;
use App\Services\LearningTaskService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LearningTaskController extends Controller
{
    use ApiResponse;

    public function __construct(private LearningTaskService $learningTaskService) {}

    public function index(Request $request, Skill $skill): JsonResponse
    {
        $this->authorize('view', $skill);

        $items = $this->learningTaskService->list($skill, $request->all());

        return $this->success(LearningTaskResource::collection($items));
    }

    public function store(StoreLearningTaskRequest $request, Skill $skill): JsonResponse
    {
        $this->authorize('update', $skill);

        $learningTask = $this->learningTaskService->create($skill, $request->user(), $request->validated());

        return $this->created(new LearningTaskResource($learningTask));
    }

    public function update(UpdateLearningTaskRequest $request, LearningTask $learningTask): JsonResponse
    {
        $this->authorize('update', $learningTask);

        $learningTask = $this->learningTaskService->update($learningTask, $request->validated());

        return $this->success(new LearningTaskResource($learningTask));
    }

    public function updateStatus(UpdateLearningTaskStatusRequest $request, LearningTask $learningTask): JsonResponse
    {
        $this->authorize('update', $learningTask);

        $learningTask = $this->learningTaskService->updateStatus($learningTask, $request->validated()['status']);

        return $this->success(new LearningTaskResource($learningTask));
    }

    public function destroy(Request $request, LearningTask $learningTask): JsonResponse
    {
        $this->authorize('delete', $learningTask);

        $this->learningTaskService->delete($learningTask);

        return $this->noContent();
    }
}
