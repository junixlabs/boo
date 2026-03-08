<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\GitHubService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GitHubController extends Controller
{
    use ApiResponse;

    public function __construct(private GitHubService $gitHubService) {}

    public function commits(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $commits = $this->gitHubService->getRecentCommits($project);

        return $this->success($commits);
    }
}
