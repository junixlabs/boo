import { useEffect, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { aiApi } from '../api/ai.api'
import { useChatStore } from '../store/chat.store'

export const chatKeys = {
  history: ['chat', 'history'] as const,
}

export function useClearChat() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (conversationId: string) => aiApi.clearChat(conversationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKeys.history }),
  })
}

export function useSendMessage() {
  const store = useChatStore()
  const qc = useQueryClient()

  // Load history from API on first mount
  useEffect(() => {
    if (store.historyLoaded) return
    aiApi.chatHistory().then((r) => {
      const data = r.data.data
      if (data?.messages?.length) {
        const msgs = data.messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))
        store.loadHistory(msgs, data.conversation_id)
      } else {
        store.loadHistory([], null)
      }
    }).catch(() => {
      store.loadHistory([], null)
    })
  }, [store.historyLoaded])

  const sendMessage = useCallback(async (text: string) => {
    const { conversationId } = useChatStore.getState()
    useChatStore.getState().addUserMessage(text)
    useChatStore.getState().setStreaming(true)
    useChatStore.getState().setStreamingContent('')

    try {
      let accumulated = ''
      await aiApi.chat(
        text,
        conversationId,
        (delta) => {
          accumulated += delta
          useChatStore.getState().setStreamingContent(accumulated)
        },
        (convId) => {
          useChatStore.getState().setConversationId(convId)
          useChatStore.getState().addAssistantMessage(accumulated)
          useChatStore.getState().setStreamingContent('')
          useChatStore.getState().setStreaming(false)
          qc.invalidateQueries({ queryKey: chatKeys.history })
        },
      )
    } catch {
      useChatStore.getState().setStreaming(false)
      useChatStore.getState().addAssistantMessage('Boo gặp lỗi rồi... thử lại nha~')
    }
  }, [qc])

  const clearMessages = useCallback(() => {
    useChatStore.getState().clearAll()
  }, [])

  return {
    messages: store.messages,
    isStreaming: store.isStreaming,
    streamingContent: store.streamingContent,
    conversationId: store.conversationId,
    sendMessage,
    clearMessages,
  }
}
