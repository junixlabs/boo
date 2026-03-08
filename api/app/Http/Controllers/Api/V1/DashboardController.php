<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DailyFocusResource;
use App\Http\Resources\ProjectNoteResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\SkillResource;
use App\Http\Resources\TaskResource;
use App\Services\DashboardService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(private DashboardService $dashboardService) {}

    public function today(Request $request): JsonResponse
    {
        $data = $this->dashboardService->today($request->user());

        return $this->success([
            'date' => $data['date'],
            'daily_focuses' => DailyFocusResource::collection($data['daily_focuses']),
            'active_projects' => ProjectResource::collection($data['active_projects']),
            'overdue_tasks' => TaskResource::collection($data['overdue_tasks']),
            'recent_ideas_count' => $data['recent_ideas_count'],
            'tasks_completed_this_week' => $data['tasks_completed_this_week'],
        ]);
    }

    public function overview(Request $request): JsonResponse
    {
        $data = $this->dashboardService->overview($request->user());

        return $this->success([
            'today_focus' => DailyFocusResource::collection($data['today_focus']),
            'active_projects' => ProjectResource::collection($data['active_projects']),
            'project_health' => $data['project_health'],
            'weekly_goals' => $data['weekly_goals'],
            'skill_progress' => SkillResource::collection($data['skill_progress']),
            'recent_notes' => ProjectNoteResource::collection($data['recent_notes']),
            'ideas_inbox_count' => $data['ideas_inbox_count'],
            'overdue_tasks_count' => $data['overdue_tasks_count'],
        ]);
    }
}
