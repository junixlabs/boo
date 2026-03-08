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
class WeeklySummaryAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function instructions(): Stringable|string
    {
        return 'You are a productivity analyst. Analyze the weekly productivity data provided and generate an actionable summary. '
            . 'Focus on patterns, achievements, and areas needing attention. Be concise and specific.';
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'summary' => $schema->string()->required(),
            'highlights' => $schema->array()->items($schema->string())->required(),
            'concerns' => $schema->array()->items($schema->string())->required(),
            'suggestions' => $schema->array()->items($schema->string())->required(),
        ];
    }
}
