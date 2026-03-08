<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\Http;

class GitHubService
{
    public function getRecentCommits(Project $project, int $limit = 20): array
    {
        $repoUrl = $project->repo_url;

        if (! $repoUrl || ! str_contains($repoUrl, 'github.com')) {
            return [];
        }

        $ownerRepo = $this->extractOwnerRepo($repoUrl);

        if (! $ownerRepo) {
            return [];
        }

        $token = config('services.github.token');

        if (! $token) {
            return [];
        }

        $response = Http::withToken($token)
            ->get("https://api.github.com/repos/{$ownerRepo}/commits", [
                'per_page' => $limit,
            ]);

        if (! $response->successful()) {
            return [];
        }

        return collect($response->json())->map(fn (array $commit) => [
            'sha' => substr($commit['sha'], 0, 7),
            'message' => strtok($commit['commit']['message'], "\n"),
            'author' => $commit['commit']['author']['name'],
            'date' => $commit['commit']['author']['date'],
            'url' => $commit['html_url'],
        ])->all();
    }

    private function extractOwnerRepo(string $url): ?string
    {
        if (preg_match('#github\.com[/:]([^/]+)/([^/.]+)#', $url, $matches)) {
            return $matches[1] . '/' . $matches[2];
        }

        return null;
    }
}
