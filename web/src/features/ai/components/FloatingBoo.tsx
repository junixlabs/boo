import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet'
import { BooAvatar } from './BooAvatar'
import { nudgeAction } from './NudgeCard'
import { ChatMessages } from './ChatMessages'
import { useNudges, useDismissNudge } from '../hooks/useNudges'
import { useSendMessage, useClearChat } from '../hooks/useChat'
import { fireBooConfetti, fireBooConfettiBig } from './ConfettiEffect'
import { aiApi } from '../api/ai.api'
import { useChatStore } from '../store/chat.store'
import type { StreakData } from '../types'

const POSITIVE_TYPES = ['daily_win', 'focus_streak', 'welcome_back', 'epic_meaning', 'milestone_progress', 'rest_in_peace', 'achievement_first_task', 'achievement_early_bird', 'achievement_streak_record', 'achievement_project_closer', 'achievement_reflection_master']

export function FloatingBoo() {
  const [open, setOpen] = useState(false)
  const { data: nudges } = useNudges()
  const dismissNudge = useDismissNudge()
  const prevNudgeTypesRef = useRef<string[]>([])
  const [streak, setStreak] = useState<StreakData | undefined>()
  const briefingCheckedRef = useRef(false)

  const {
    messages,
    isStreaming,
    streamingContent,
    conversationId,
    sendMessage,
    clearMessages,
  } = useSendMessage()
  const clearChat = useClearChat()

  const count = nudges?.length ?? 0
  const topExpression = nudges?.[0]?.boo_expression ?? 'default'

  // Toast + confetti on new nudges
  useEffect(() => {
    if (!nudges || nudges.length === 0) {
      prevNudgeTypesRef.current = []
      return
    }

    const currentTypes = nudges.map((n) => n.type)
    const prevTypes = prevNudgeTypesRef.current

    const newNudges = nudges.filter((n) => !prevTypes.includes(n.type))

    for (const nudge of newNudges) {
      if (POSITIVE_TYPES.includes(nudge.type)) {
        const bigTypes = ['rest_in_peace', 'achievement_streak_record', 'achievement_project_closer']
        bigTypes.includes(nudge.type) ? fireBooConfettiBig() : fireBooConfetti()
      }

      if (nudge.priority === 'high' || POSITIVE_TYPES.includes(nudge.type)) {
        const action = nudgeAction[nudge.type]
        toast(nudge.title, {
          description: nudge.message,
          action: action ? { label: action.label, onClick: () => window.location.assign(action.route) } : undefined,
        })
      }
    }

    prevNudgeTypesRef.current = currentTypes
  }, [nudges])

  // Load daily briefing on first open of the day
  const loadBriefing = useCallback(() => {
    if (briefingCheckedRef.current) return
    briefingCheckedRef.current = true

    const lastBriefingDate = localStorage.getItem('boo_briefing_date')
    const today = new Date().toISOString().slice(0, 10)

    if (lastBriefingDate === today) return

    aiApi.dailyBriefing().then((r) => {
      const b = r.data.data
      if (!b) return

      setStreak({
        current_streak: b.streak,
        longest_streak: 0,
        today_focus_total: b.focus_total,
        today_focus_done: b.focus_done,
      })

      // Only show briefing if there's meaningful data and no existing messages
      const hasContent = b.overdue_tasks > 0 || b.focus_total > 0 || b.streak > 0 || b.ideas_count > 0
      if (!hasContent) {
        localStorage.setItem('boo_briefing_date', today)
        return
      }

      // Inject briefing as a local proactive Boo message (not sent to AI)
      if (messages.length === 0) {
        const lines: string[] = []
        const hour = new Date().getHours()
        if (hour < 12) lines.push('Chào buổi sáng~ Đây là update cho hôm nay:')
        else if (hour < 18) lines.push('Chiều rồi~ Đây là tình hình hôm nay:')
        else lines.push('Tối rồi~ Tóm tắt ngày hôm nay:')

        if (b.overdue_tasks > 0) lines.push(`- 📋 ${b.overdue_tasks} task overdue`)
        if (b.focus_total === 0) lines.push('- 🎯 Chưa set focus')
        else lines.push(`- 🎯 Focus: ${b.focus_done}/${b.focus_total} done`)
        if (b.streak > 0) lines.push(`- 🔥 Streak: ${b.streak} ngày`)
        if (b.ideas_count > 0) lines.push(`- 💡 ${b.ideas_count} ideas chờ xử lý`)

        if (b.focus_total === 0) lines.push('\nBạn muốn set focus luôn không?')

        useChatStore.getState().addProactiveMessage(lines.join('\n'), 'happy')
      }

      localStorage.setItem('boo_briefing_date', today)
    }).catch(() => {
      // ignore
    })
  }, [messages.length])

  // Load briefing when drawer opens
  useEffect(() => {
    if (open) loadBriefing()
  }, [open, loadBriefing])

  const hasNewNudges = count > 0

  function handleClear() {
    if (conversationId) {
      clearChat.mutate(conversationId)
    }
    clearMessages()
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg transition-transform hover:scale-105 active:scale-95 ${hasNewNudges ? 'boo-pulse' : ''}`}
      >
        <BooAvatar size={32} expression={topExpression} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {/* Chat — full-screen on mobile, side sheet on desktop */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex !w-full flex-col gap-0 p-0 sm:!max-w-md"
        >
          {/* Compact header */}
          <div className="flex h-12 shrink-0 items-center gap-2 border-b px-2 sm:px-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <BooAvatar size={22} expression="happy" />
            <SheetTitle className="flex-1 text-sm font-medium">Boo</SheetTitle>
            <SheetDescription className="sr-only">Boo assistant panel</SheetDescription>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleClear}
                disabled={clearChat.isPending}
                title="Clear chat"
              >
                {clearChat.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Chat content — fills remaining space */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-2 sm:px-4 sm:pb-4">
            <ChatMessages
              messages={messages}
              isStreaming={isStreaming}
              streamingContent={streamingContent}
              onSend={sendMessage}
              compact
              autoFocus={open}
              nudges={nudges}
              streak={streak}
              onDismissNudge={(type) => dismissNudge.mutate(type)}
              onNudgeAction={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
