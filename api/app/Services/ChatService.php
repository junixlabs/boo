<?php

namespace App\Services;

use App\Ai\Agents\ChatAgent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChatService
{
    public function prepareChat(User $user, string $message, ?string $conversationId = null): array
    {
        $context = $this->buildContext($user);
        $fullMessage = $message . "\n\n---\n[Context]\n" . $context;

        $agent = new ChatAgent;

        if ($conversationId) {
            $agent->continue($conversationId, $user);
        } else {
            $agent->forUser($user);
        }

        return [
            'agent' => $agent,
            'message' => $fullMessage,
        ];
    }

    public function getHistory(User $user, ?string $conversationId = null): array
    {
        if (! $conversationId) {
            $conversation = DB::table('agent_conversations')
                ->where('user_id', $user->id)
                ->orderByDesc('updated_at')
                ->first();

            if (! $conversation) {
                return ['conversation_id' => null, 'messages' => []];
            }

            $conversationId = $conversation->id;
        }

        $conversation = DB::table('agent_conversations')
            ->where('id', $conversationId)
            ->where('user_id', $user->id)
            ->first();

        if (! $conversation) {
            return ['conversation_id' => null, 'messages' => []];
        }

        $messages = DB::table('agent_conversation_messages')
            ->where('conversation_id', $conversationId)
            ->where('user_id', $user->id)
            ->orderBy('created_at')
            ->get(['role', 'content', 'created_at'])
            ->map(fn ($m) => [
                'role' => $m->role,
                'content' => $m->role === 'user' ? $this->stripContext($m->content) : $m->content,
                'created_at' => $m->created_at,
            ])
            ->all();

        return [
            'conversation_id' => $conversationId,
            'messages' => $messages,
        ];
    }

    public function clearHistory(User $user, string $conversationId): void
    {
        $conversation = DB::table('agent_conversations')
            ->where('id', $conversationId)
            ->where('user_id', $user->id)
            ->first();

        if (! $conversation) {
            return;
        }

        DB::table('agent_conversation_messages')
            ->where('conversation_id', $conversationId)
            ->delete();

        DB::table('agent_conversations')
            ->where('id', $conversationId)
            ->delete();
    }

    private function buildContext(User $user): string
    {
        $now = Carbon::now($user->timezone ?? 'UTC');

        $activeTasks = $user->tasks()
            ->whereNotIn('status', ['done', 'cancelled'])
            ->count();

        $overdueTasks = $user->tasks()
            ->where('due_date', '<', $now->toDateString())
            ->whereNotIn('status', ['done', 'cancelled'])
            ->count();

        $todayFocuses = $user->dailyFocuses()
            ->where('focus_date', $now->toDateString())
            ->with('task:id,title,status')
            ->get()
            ->map(fn ($f) => $f->task ? "{$f->task->title} (" . Str::headline($f->task->status->value) . ")" : null)
            ->filter()
            ->implode(', ');

        $activeProjects = $user->projects()
            ->where('status', 'active')
            ->pluck('title')
            ->implode(', ');

        $activeGoals = $user->goals()
            ->where('status', 'active')
            ->pluck('title')
            ->implode(', ');

        $timezone = $user->timezone ?? 'UTC';

        $language = $user->preferred_language ?? 'vi';

        return "DateTime: {$now->format('Y-m-d H:i')} ({$now->format('l')}), Timezone: {$timezone}\n"
            . "Language: {$language}\n"
            . "Active tasks: {$activeTasks}\n"
            . "Overdue tasks: {$overdueTasks}\n"
            . "Today's focuses: " . ($todayFocuses ?: 'None') . "\n"
            . "Active projects: " . ($activeProjects ?: 'None') . "\n"
            . "Active goals: " . ($activeGoals ?: 'None');
    }

    private function stripContext(string $content): string
    {
        $pos = strpos($content, "\n\n---\n[Context]");

        return $pos !== false ? substr($content, 0, $pos) : $content;
    }
}
