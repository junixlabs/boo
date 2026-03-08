<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectNoteRequest;
use App\Http\Requests\UpdateProjectNoteRequest;
use App\Http\Resources\ProjectNoteResource;
use App\Models\Project;
use App\Models\ProjectNote;
use App\Services\ProjectNoteService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectNoteController extends Controller
{
    use ApiResponse;

    public function __construct(private ProjectNoteService $projectNoteService) {}

    public function index(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $notes = $this->projectNoteService->list($project, $request->all());

        return ProjectNoteResource::collection($notes)->response();
    }

    public function store(StoreProjectNoteRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $note = $this->projectNoteService->create($project, $request->user(), $request->validated());

        return $this->created(new ProjectNoteResource($note));
    }

    public function update(UpdateProjectNoteRequest $request, ProjectNote $projectNote): JsonResponse
    {
        $this->authorize('update', $projectNote);

        $projectNote = $this->projectNoteService->update($projectNote, $request->validated());

        return $this->success(new ProjectNoteResource($projectNote));
    }

    public function destroy(Request $request, ProjectNote $projectNote): JsonResponse
    {
        $this->authorize('delete', $projectNote);

        $this->projectNoteService->delete($projectNote);

        return $this->noContent();
    }
}
