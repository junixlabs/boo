import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatBubble, StreamingBubble } from './ChatBubble'
import { BooAvatar } from './BooAvatar'
import type { ChatMessage } from '../types'

const quickChips = [
  'Hôm nay Boo gợi ý gì?',
  'Tổng kết tuần này',
  'Task nào nên ưu tiên?',
  'Review tiến độ project',
]

interface ChatMessagesProps {
  messages: ChatMessage[]
  isStreaming: boolean
  streamingContent: string
  onSend: (text: string) => void
  compact?: boolean
}

export function ChatMessages({
  messages,
  isStreaming,
  streamingContent,
  onSend,
  compact,
}: ChatMessagesProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  function handleSend() {
    const text = input.trim()
    if (!text || isStreaming) return
    setInput('')
    onSend(text)
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-hidden">
      {/* Messages */}
      <div className="flex flex-1 flex-col space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 && !isStreaming ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <BooAvatar size={compact ? 48 : 64} expression="default" />
            <p className="text-sm text-muted-foreground">
              Boo ở đây rồi~ Hỏi Boo bất cứ điều gì nha!
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => onSend(chip)}
                  disabled={isStreaming}
                  className="rounded-full border bg-card px-3 py-1.5 text-xs transition-colors hover:bg-accent disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}
            {isStreaming && streamingContent && (
              <StreamingBubble content={streamingContent} />
            )}
            {isStreaming && !streamingContent && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BooAvatar size={24} expression="default" className="animate-pulse" />
                Boo đang suy nghĩ...
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-2 pb-[env(safe-area-inset-bottom)]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Chat with Boo..."
          disabled={isStreaming}
          className="h-10 flex-1 rounded-full border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
        />
        <Button
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full"
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
        >
          {isStreaming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
