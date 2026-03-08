<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReflectionRequest;
use App\Http\Requests\UpdateReflectionRequest;
use App\Http\Resources\ReflectionResource;
use App\Models\Reflection;
use App\Services\ReflectionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReflectionController extends Controller
{
    use ApiResponse;

    public function __construct(private ReflectionService $reflectionService) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->reflectionService->list($request->user(), $request->all());

        return ReflectionResource::collection($items)->response();
    }

    public function store(StoreReflectionRequest $request): JsonResponse
    {
        $reflection = $this->reflectionService->create($request->user(), $request->validated());

        return $this->created(new ReflectionResource($reflection));
    }

    public function update(UpdateReflectionRequest $request, Reflection $reflection): JsonResponse
    {
        $this->authorize('update', $reflection);

        $reflection = $this->reflectionService->update($reflection, $request->validated());

        return $this->success(new ReflectionResource($reflection));
    }

    public function destroy(Request $request, Reflection $reflection): JsonResponse
    {
        $this->authorize('delete', $reflection);

        $this->reflectionService->delete($reflection);

        return $this->noContent();
    }
}
