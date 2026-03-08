import { create } from 'zustand'
import type { ChatMessage } from '../types'

interface ChatState {
  messages: ChatMessage[]
  isStreaming: boolean
  streamingContent: string
  conversationId: string | null
  historyLoaded: boolean

  addUserMessage: (content: string) => void
  addAssistantMessage: (content: string) => void
  setStreaming: (v: boolean) => void
  setStreamingContent: (v: string) => void
  setConversationId: (id: string | null) => void
  loadHistory: (messages: ChatMessage[], conversationId: string | null) => void
  clearAll: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  streamingContent: '',
  conversationId: null,
  historyLoaded: false,

  addUserMessage: (content) =>
    set((s) => ({ messages: [...s.messages, { role: 'user', content }] })),

  addAssistantMessage: (content) =>
    set((s) => ({ messages: [...s.messages, { role: 'assistant', content }] })),

  setStreaming: (v) => set({ isStreaming: v }),

  setStreamingContent: (v) => set({ streamingContent: v }),

  setConversationId: (id) => set({ conversationId: id }),

  loadHistory: (messages, conversationId) =>
    set({ messages, conversationId, historyLoaded: true }),

  clearAll: () =>
    set({ messages: [], streamingContent: '', conversationId: null }),
}))
