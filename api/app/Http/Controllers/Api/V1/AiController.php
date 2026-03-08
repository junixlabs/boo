<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChatRequest;
use App\Http\Requests\ReviewPromptRequest;
use App\Http\Requests\SuggestPrioritiesRequest;
use App\Http\Requests\WeeklySummaryRequest;
use App\Services\AiService;
use App\Services\ChatService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Ai\Streaming\Events\TextDelta;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AiController extends Controller
{
    use ApiResponse;

    public function __construct(
        private AiService $aiService,
        private ChatService $chatService,
    ) {}

    public function weeklySummary(WeeklySummaryRequest $request): JsonResponse
    {
        $result = $this->aiService->weeklySummary($request->user(), $request->validated('week_start'));

        return $this->success($result);
    }

    public function suggestPriorities(SuggestPrioritiesRequest $request): JsonResponse
    {
        $result = $this->aiService->suggestPriorities($request->user(), $request->validated('date'));

        return $this->success($result);
    }

    public function reviewPrompt(ReviewPromptRequest $request): JsonResponse
    {
        $result = $this->aiService->reviewPrompt(
            $request->user(),
            $request->validated('type'),
            $request->validated('period_start'),
        );

        return $this->success($result);
    }

    public function chat(ChatRequest $request): StreamedResponse
    {
        $prepared = $this->chatService->prepareChat(
            $request->user(),
            $request->validated('message'),
            $request->validated('conversation_id'),
        );

        $agent = $prepared['agent'];
        $stream = $agent->stream($prepared['message']);

        return response()->stream(function () use ($stream, $agent) {
            foreach ($stream as $event) {
                if ($event instanceof TextDelta) {
                    echo 'data: '.json_encode(['type' => 'text_delta', 'delta' => $event->delta])."\n\n";

                    if (ob_get_level() > 0) {
                        ob_flush();
                    }

                    flush();
                }
            }

            echo 'data: '.json_encode([
                'type' => 'done',
                'conversation_id' => $agent->currentConversation(),
            ])."\n\n";

            if (ob_get_level() > 0) {
                ob_flush();
            }

            flush();
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    public function chatHistory(Request $request): JsonResponse
    {
        $result = $this->chatService->getHistory(
            $request->user(),
            $request->query('conversation_id'),
        );

        return $this->success($result);
    }

    public function clearChat(Request $request, string $conversationId): JsonResponse
    {
        $this->chatService->clearHistory($request->user(), $conversationId);

        return $this->noContent();
    }
}
