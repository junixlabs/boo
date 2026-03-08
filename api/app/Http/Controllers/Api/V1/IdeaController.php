<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConvertIdeaRequest;
use App\Http\Requests\StoreIdeaRequest;
use App\Http\Requests\UpdateIdeaRequest;
use App\Http\Resources\IdeaResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Models\Idea;
use App\Services\IdeaService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IdeaController extends Controller
{
    use ApiResponse;

    public function __construct(private IdeaService $ideaService) {}

    public function index(Request $request): JsonResponse
    {
        $ideas = $this->ideaService->list($request->user(), $request->all());

        return IdeaResource::collection($ideas)->response();
    }

    public function store(StoreIdeaRequest $request): JsonResponse
    {
        $idea = $this->ideaService->create($request->user(), $request->validated());

        return $this->created(new IdeaResource($idea));
    }

    public function update(UpdateIdeaRequest $request, Idea $idea): JsonResponse
    {
        $this->authorize('update', $idea);

        $idea = $this->ideaService->update($idea, $request->validated());

        return $this->success(new IdeaResource($idea));
    }

    public function destroy(Request $request, Idea $idea): JsonResponse
    {
        $this->authorize('delete', $idea);

        $this->ideaService->delete($idea);

        return $this->noContent();
    }

    public function convert(ConvertIdeaRequest $request, Idea $idea): JsonResponse
    {
        $this->authorize('update', $idea);

        $result = $this->ideaService->convert($request->user(), $idea, $request->validated());

        $createdResource = $result['created'] instanceof \App\Models\Project
            ? new ProjectResource($result['created'])
            : new TaskResource($result['created']);

        return $this->success([
            'idea' => new IdeaResource($result['idea']),
            'created' => $createdResource,
        ]);
    }

    public function discard(Request $request, Idea $idea): JsonResponse
    {
        $this->authorize('update', $idea);

        $idea = $this->ideaService->discard($idea);

        return $this->success(new IdeaResource($idea));
    }
}
