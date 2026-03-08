import api from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import type { ApiResponse } from '@/types/api'
import type {
  AiWeeklySummaryRequest,
  AiSuggestPrioritiesRequest,
  AiReviewPromptRequest,
  AiResult,
  Nudge,
  ConversationHistory,
  DailyBriefing,
  BooExpression,
} from '../types'

export const aiApi = {
  weeklySummary: (data: AiWeeklySummaryRequest) =>
    api.post<ApiResponse<AiResult>>('/ai/weekly-summary', data),

  suggestPriorities: (data: AiSuggestPrioritiesRequest) =>
    api.post<ApiResponse<AiResult>>('/ai/suggest-priorities', data),

  reviewPrompt: (data: AiReviewPromptRequest) =>
    api.post<ApiResponse<AiResult>>('/ai/review-prompt', data),

  // Nudges
  getNudges: () =>
    api.get<ApiResponse<Nudge[]>>('/ai/nudges'),

  dismissNudge: (type: string) =>
    api.post('/ai/nudges/dismiss', { type }),

  // Chat
  chatHistory: () =>
    api.get<ApiResponse<ConversationHistory>>('/ai/chat/history'),

  clearChat: (conversationId: string) =>
    api.delete(`/ai/chat/${conversationId}`),

  // Daily briefing
  dailyBriefing: () =>
    api.get<ApiResponse<DailyBriefing>>('/ai/daily-briefing'),

  // SSE streaming chat - uses fetch instead of axios
  chat: async (
    message: string,
    conversationId: string | null,
    onDelta: (text: string) => void,
    onDone: (convId: string, expression?: BooExpression) => void,
  ) => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        ...(conversationId ? { conversation_id: conversationId } : {}),
      }),
    })

    if (!response.ok) {
      throw new Error(`Chat failed: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const jsonStr = line.slice(6).trim()
        if (!jsonStr) continue

        try {
          const event = JSON.parse(jsonStr)
          if (event.type === 'text_delta') {
            onDelta(event.delta)
          } else if (event.type === 'done') {
            onDone(event.conversation_id, event.boo_expression)
          }
        } catch {
          // skip malformed JSON
        }
      }
    }
  },
}
