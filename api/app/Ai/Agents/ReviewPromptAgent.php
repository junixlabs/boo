<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider(Lab::Gemini)]
#[Model('gemini-2.0-flash')]
class ReviewPromptAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function instructions(): Stringable|string
    {
        return 'You are a personal growth coach. Based on the provided period data (tasks, projects, skills, goals), '
            . 'generate thoughtful, introspective reflection questions that help the user gain insight into their productivity, '
            . 'growth, and decision-making patterns. Questions should be specific to the data provided.';
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'prompts' => $schema->array()->items($schema->string())->required(),
        ];
    }
}
