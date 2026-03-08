<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\DismissNudgeRequest;
use App\Services\NudgeService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NudgeController extends Controller
{
    use ApiResponse;

    public function __construct(private NudgeService $nudgeService) {}

    public function index(Request $request): JsonResponse
    {
        $nudges = $this->nudgeService->getNudges($request->user());

        return $this->success($nudges);
    }

    public function dismiss(DismissNudgeRequest $request): JsonResponse
    {
        $this->nudgeService->dismiss($request->user(), $request->validated('nudge_type'));

        return $this->success(['dismissed' => true]);
    }
}
