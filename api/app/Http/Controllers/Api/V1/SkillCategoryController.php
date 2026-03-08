<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillCategoryRequest;
use App\Http\Requests\UpdateSkillCategoryRequest;
use App\Http\Resources\SkillCategoryResource;
use App\Models\SkillCategory;
use App\Services\SkillCategoryService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillCategoryController extends Controller
{
    use ApiResponse;

    public function __construct(private SkillCategoryService $skillCategoryService) {}

    public function index(Request $request): JsonResponse
    {
        $categories = $this->skillCategoryService->list($request->user());

        return $this->success(SkillCategoryResource::collection($categories));
    }

    public function store(StoreSkillCategoryRequest $request): JsonResponse
    {
        $category = $this->skillCategoryService->create($request->user(), $request->validated());

        return $this->created(new SkillCategoryResource($category));
    }

    public function update(UpdateSkillCategoryRequest $request, SkillCategory $skillCategory): JsonResponse
    {
        $this->authorize('update', $skillCategory);

        $category = $this->skillCategoryService->update($skillCategory, $request->validated());

        return $this->success(new SkillCategoryResource($category));
    }

    public function destroy(Request $request, SkillCategory $skillCategory): JsonResponse
    {
        $this->authorize('delete', $skillCategory);

        $this->skillCategoryService->delete($skillCategory);

        return $this->noContent();
    }
}
