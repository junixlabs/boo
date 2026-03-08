<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMilestoneRequest;
use App\Http\Requests\UpdateMilestoneRequest;
use App\Http\Requests\UpdateMilestoneStatusRequest;
use App\Http\Resources\MilestoneResource;
use App\Models\Milestone;
use App\Models\Project;
use App\Services\MilestoneService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{
    use ApiResponse;

    public function __construct(private MilestoneService $milestoneService) {}

    public function index(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $milestones = $this->milestoneService->list($project, $request->all());

        return $this->success(MilestoneResource::collection($milestones));
    }

    public function store(StoreMilestoneRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $milestone = $this->milestoneService->create($project, $request->validated());

        return $this->created(new MilestoneResource($milestone));
    }

    public function update(UpdateMilestoneRequest $request, Milestone $milestone): JsonResponse
    {
        $this->authorize('update', $milestone);

        $milestone = $this->milestoneService->update($milestone, $request->validated());

        return $this->success(new MilestoneResource($milestone));
    }

    public function updateStatus(UpdateMilestoneStatusRequest $request, Milestone $milestone): JsonResponse
    {
        $this->authorize('update', $milestone);

        $milestone = $this->milestoneService->updateStatus($milestone, $request->validated()['status']);

        return $this->success(new MilestoneResource($milestone));
    }

    public function destroy(Request $request, Milestone $milestone): JsonResponse
    {
        $this->authorize('delete', $milestone);

        $this->milestoneService->delete($milestone);

        return $this->noContent();
    }
}
