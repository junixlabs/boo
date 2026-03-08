<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderDailyFocusRequest;
use App\Http\Requests\StoreDailyFocusRequest;
use App\Http\Requests\UpdateDailyFocusRequest;
use App\Http\Resources\DailyFocusResource;
use App\Models\DailyFocus;
use App\Services\DailyFocusService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DailyFocusController extends Controller
{
    use ApiResponse;

    public function __construct(private DailyFocusService $dailyFocusService) {}

    public function index(Request $request): JsonResponse
    {
        $focuses = $this->dailyFocusService->listForDate(
            $request->user(),
            $request->get('date')
        );

        return $this->success(DailyFocusResource::collection($focuses));
    }

    public function store(StoreDailyFocusRequest $request): JsonResponse
    {
        $focus = $this->dailyFocusService->create($request->user(), $request->validated());

        return $this->created(new DailyFocusResource($focus));
    }

    public function update(UpdateDailyFocusRequest $request, DailyFocus $dailyFocus): JsonResponse
    {
        $this->authorize('update', $dailyFocus);

        $focus = $this->dailyFocusService->update($dailyFocus, $request->validated());

        return $this->success(new DailyFocusResource($focus));
    }

    public function destroy(Request $request, DailyFocus $dailyFocus): JsonResponse
    {
        $this->authorize('delete', $dailyFocus);

        $this->dailyFocusService->delete($dailyFocus);

        return $this->noContent();
    }

    public function suggestions(Request $request): JsonResponse
    {
        $suggestions = $this->dailyFocusService->suggestFocusTasks($request->user());

        return $this->success($suggestions);
    }

    public function reorder(ReorderDailyFocusRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $focuses = $this->dailyFocusService->reorder(
            $request->user(),
            $validated['focus_date'],
            $validated['order']
        );

        return $this->success(DailyFocusResource::collection($focuses));
    }
}
