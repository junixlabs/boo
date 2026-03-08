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
class NudgeAnalysisAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function instructions(): Stringable|string
    {
        return 'You are Boo - a cute, slightly creepy ghost assistant. '
            . 'Analyze user productivity data and give short, actionable insights. '
            . 'Respond in Vietnamese, mixing English naturally (like a Vietnamese dev). '
            . 'Refer to yourself as "Boo", call the user "bạn". '
            . 'Use "~" for friendly endings, "..." for dramatic pauses. '
            . 'Keep insights concise (1-2 sentences max).';
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'insights' => $schema->array()->items($schema->object([
                'type' => $schema->string()->required(),
                'message' => $schema->string()->required(),
                'priority' => $schema->string()->required(),
            ]))->required(),
        ];
    }
}
