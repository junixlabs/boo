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
            $fullText = '';

            foreach ($stream as $event) {
                if ($event instanceof TextDelta) {
                    $fullText .= $event->delta;
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
                'boo_expression' => $this->detectExpression($fullText),
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

    public function dailyBriefing(Request $request): JsonResponse
    {
        $briefing = $this->chatService->getDailyBriefing($request->user());

        return $this->success($briefing);
    }

    private function detectExpression(string $text): string
    {
        $lower = mb_strtolower($text);

        $happyWords = ['xong', 'tốt', 'giỏi', 'tuyệt', 'chúc mừng', 'hoàn thành', 'great', 'awesome', 'streak', 'yay', 'nice', '🎉', '🔥', '💪'];
        $sadWords = ['chưa', 'quên', 'overdue', 'trễ', 'chậm', 'skip', 'miss', 'stuck', 'bỏ lỡ'];
        $spookyWords = ['deadline', 'hạn chót', 'cảnh báo', 'warning', 'urgent', 'khẩn', 'gấp'];
        $dramaticWords = ['haunt', 'ghost', 'boo sẽ', 'boo không', '*boo', 'khóc', 'buồn quá'];

        foreach ($dramaticWords as $w) {
            if (str_contains($lower, $w)) {
                return 'dramatic';
            }
        }

        foreach ($spookyWords as $w) {
            if (str_contains($lower, $w)) {
                return 'spooky';
            }
        }

        $happyCount = 0;
        $sadCount = 0;

        foreach ($happyWords as $w) {
            if (str_contains($lower, $w)) {
                $happyCount++;
            }
        }

        foreach ($sadWords as $w) {
            if (str_contains($lower, $w)) {
                $sadCount++;
            }
        }

        if ($happyCount > $sadCount) {
            return 'happy';
        }

        if ($sadCount > 0) {
            return 'sad';
        }

        return 'default';
    }
}
