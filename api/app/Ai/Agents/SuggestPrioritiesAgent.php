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
class SuggestPrioritiesAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function instructions(): Stringable|string
    {
        return 'You are a task prioritization expert. Evaluate the provided tasks by urgency, priority level, due dates, '
            . 'and goal alignment. Suggest the top tasks to focus on today with clear reasoning for each.';
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'suggested_focuses' => $schema->array()->items($schema->object([
                'task_id' => $schema->integer()->required(),
                'reason' => $schema->string()->required(),
            ]))->required(),
        ];
    }
}
