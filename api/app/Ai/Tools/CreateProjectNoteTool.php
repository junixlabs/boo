<?php

namespace App\Ai\Tools;

use App\Services\ProjectNoteService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateProjectNoteTool extends BooTool
{
    public function description(): string
    {
        return 'Create a note for a project. Requires title, content, and project_id (use ListProjectsTool to find _ref).';
    }

    public function execute(Request $request): string
    {
        $project = $this->user->projects()->find($request['project_id']);
        if (! $project) {
            return 'Error: Project not found or does not belong to user.';
        }

        $data = [
            'title' => $request['title'],
            'content' => $request['content'],
        ];

        $service = app(ProjectNoteService::class);
        $note = $service->create($project, $this->user, $data);

        return 'Project note created: ' . $this->formatModel($note);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->description('Note title')->required(),
            'content' => $schema->string()->description('Note content')->required(),
            'project_id' => $schema->integer()->description('Project _ref from ListProjectsTool. Look up by name, never ask user.')->required(),
        ];
    }
}
