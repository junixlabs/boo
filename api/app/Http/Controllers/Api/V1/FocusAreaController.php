<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFocusAreaRequest;
use App\Http\Requests\UpdateFocusAreaRequest;
use App\Http\Resources\FocusAreaResource;
use App\Models\FocusArea;
use App\Services\FocusAreaService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FocusAreaController extends Controller
{
    use ApiResponse;

    public function __construct(private FocusAreaService $focusAreaService) {}

    public function index(Request $request): JsonResponse
    {
        $focusAreas = $this->focusAreaService->list($request->user(), $request->all());

        return $this->success(FocusAreaResource::collection($focusAreas));
    }

    public function store(StoreFocusAreaRequest $request): JsonResponse
    {
        $focusArea = $this->focusAreaService->create($request->user(), $request->validated());

        return $this->created(new FocusAreaResource($focusArea));
    }

    public function update(UpdateFocusAreaRequest $request, FocusArea $focusArea): JsonResponse
    {
        $this->authorize('update', $focusArea);

        $focusArea = $this->focusAreaService->update($focusArea, $request->validated());

        return $this->success(new FocusAreaResource($focusArea));
    }

    public function destroy(Request $request, FocusArea $focusArea): JsonResponse
    {
        $this->authorize('delete', $focusArea);

        $this->focusAreaService->delete($focusArea);

        return $this->noContent();
    }
}
