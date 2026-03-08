<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use App\Services\SkillService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    use ApiResponse;

    public function __construct(private SkillService $skillService) {}

    public function index(Request $request): JsonResponse
    {
        $skills = $this->skillService->list($request->user(), $request->all());

        return $this->success(SkillResource::collection($skills));
    }

    public function store(StoreSkillRequest $request): JsonResponse
    {
        $skill = $this->skillService->create($request->user(), $request->validated());

        return $this->created(new SkillResource($skill));
    }

    public function update(UpdateSkillRequest $request, Skill $skill): JsonResponse
    {
        $this->authorize('update', $skill);

        $skill = $this->skillService->update($skill, $request->validated());

        return $this->success(new SkillResource($skill));
    }

    public function destroy(Request $request, Skill $skill): JsonResponse
    {
        $this->authorize('delete', $skill);

        $this->skillService->delete($skill);

        return $this->noContent();
    }

    public function syncProjects(Request $request, Skill $skill): JsonResponse
    {
        $this->authorize('update', $skill);

        $validated = $request->validate([
            'project_ids' => ['required', 'array'],
            'project_ids.*' => ['exists:projects,id'],
        ]);

        $skill = $this->skillService->syncProjects($skill, $validated['project_ids']);

        return $this->success(new SkillResource($skill));
    }
}
