import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatBubble, StreamingBubble } from './ChatBubble'
import { BooAvatar } from './BooAvatar'
import { NudgeCard } from './NudgeCard'
import type { ChatMessage, Nudge, StreakData } from '../types'

function getTimeGreeting(streak?: number): string {
  const hour = new Date().getHours()
  let greeting: string

  if (hour >= 6 && hour < 12) {
    greeting = 'Chào buổi sáng~ Hôm nay mình làm gì nha!'
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Chiều rồi~ Cần Boo giúp gì không?'
  } else if (hour >= 18 && hour < 23) {
    greeting = 'Tối rồi~ Xem lại ngày hôm nay đi!'
  } else {
    greeting = 'Khuya rồi~ Nghỉ ngơi sớm nha bạn!'
  }

  if (streak && streak >= 3) {
    greeting += ` 🔥 ${streak} ngày liên tiếp!`
  }

  return greeting
}

function getContextualChips(nudges?: Nudge[]): string[] {
  const hour = new Date().getHours()
  const chips: string[] = []

  // Nudge-related chips first
  if (nudges?.length) {
    const first = nudges[0]
    if (first.type === 'no_daily_focus') chips.push('Set focus cho hôm nay')
    else if (first.type === 'overdue_tasks') chips.push('Mấy task overdue rồi?')
    else if (first.type === 'task_stuck') chips.push('Task nào đang stuck?')
  }

  // Time-based chips
  if (hour >= 6 && hour < 12) {
    chips.push('Hôm nay focus gì?', 'Có gì cần làm?')
  } else if (hour >= 12 && hour < 18) {
    chips.push('Tiến độ hôm nay?', 'Task nào nên ưu tiên?')
  } else {
    chips.push('Tổng kết hôm nay', 'Plan ngày mai')
  }

  // Always-available
  chips.push('Tổng kết tuần này')

  // Deduplicate and limit
  return [...new Set(chips)].slice(0, 4)
}

function getDateLabel(ts: string): string {
  const d = new Date(ts)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Hôm nay'
  if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua'
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })
}

interface ChatMessagesProps {
  messages: ChatMessage[]
  isStreaming: boolean
  streamingContent: string
  onSend: (text: string) => void
  compact?: boolean
  nudges?: Nudge[]
  streak?: StreakData
  onDismissNudge?: (type: string) => void
  onNudgeAction?: () => void
}

export function ChatMessages({
  messages,
  isStreaming,
  streamingContent,
  onSend,
  compact,
  nudges,
  streak,
  onDismissNudge,
  onNudgeAction,
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

  const isEmpty = messages.length === 0 && !isStreaming
  const activeNudges = nudges?.filter(Boolean) ?? []
  const chips = useMemo(() => getContextualChips(nudges), [nudges])

  // Group messages by date for separators
  const messagesWithSeparators = useMemo(() => {
    const result: { type: 'separator' | 'message'; label?: string; message?: ChatMessage; index?: number }[] = []
    let lastDate = ''

    messages.forEach((msg, i) => {
      if (msg.timestamp) {
        const dateLabel = getDateLabel(msg.timestamp)
        if (dateLabel !== lastDate) {
          result.push({ type: 'separator', label: dateLabel })
          lastDate = dateLabel
        }
      }
      result.push({ type: 'message', message: msg, index: i })
    })

    return result
  }, [messages])

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden">
      {/* Messages */}
      <div className="flex flex-1 flex-col space-y-3 overflow-y-auto pr-1">
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <BooAvatar size={compact ? 48 : 64} expression="default" />
            <p className="text-sm text-muted-foreground">
              {getTimeGreeting(streak?.current_streak)}
            </p>
          </div>
        ) : (
          <>
            {/* Inline nudge cards at top of chat */}
            {activeNudges.length > 0 && (
              <div className="space-y-2 pb-2">
                {activeNudges.map((n) => (
                  <NudgeCard
                    key={n.type}
                    nudge={n}
                    onDismiss={(type) => onDismissNudge?.(type)}
                    onAction={onNudgeAction}
                  />
                ))}
              </div>
            )}

            {/* Messages with date separators */}
            {messagesWithSeparators.map((item, i) => {
              if (item.type === 'separator') {
                return (
                  <div key={`sep-${i}`} className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] text-muted-foreground">{item.label}</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )
              }
              return <ChatBubble key={item.index} message={item.message!} />
            })}

            {/* Streaming bubble */}
            {isStreaming && streamingContent && (
              <StreamingBubble content={streamingContent} />
            )}

            {/* Typing indicator - 3 dot bounce */}
            {isStreaming && !streamingContent && (
              <div className="flex items-center gap-2">
                <BooAvatar size={28} expression="default" className="shrink-0" />
                <div className="flex items-center gap-1 rounded-lg border bg-card px-3 py-2.5">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Contextual quick chips */}
      {!isStreaming && (
        <div className="flex gap-1.5 overflow-x-auto py-1">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => onSend(chip)}
              className="shrink-0 rounded-full border bg-card px-2.5 py-1 text-[11px] transition-colors hover:bg-accent"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 pb-[env(safe-area-inset-bottom)]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Nhắn cho Boo..."
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
