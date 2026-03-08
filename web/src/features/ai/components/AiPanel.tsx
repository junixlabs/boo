import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeeklySummary, useSuggestPriorities, useReviewPrompt } from '../hooks/useAi'
import type { AiResult } from '../types'

function getMonday(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function AiPanel() {
  const [result, setResult] = useState<AiResult | null>(null)
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const weeklySummary = useWeeklySummary()
  const suggestPriorities = useSuggestPriorities()
  const reviewPrompt = useReviewPrompt()

  const isPending = weeklySummary.isPending || suggestPriorities.isPending || reviewPrompt.isPending

  function handleAction(action: string) {
    setActiveAction(action)
    const onSuccess = (data: AiResult) => setResult(data)

    if (action === 'weekly-summary') {
      weeklySummary.mutate({ week_start: getMonday(new Date()) }, { onSuccess })
    } else if (action === 'suggest-priorities') {
      suggestPriorities.mutate({ date: today() }, { onSuccess })
    } else if (action === 'review-weekly') {
      reviewPrompt.mutate({ type: 'weekly', period_start: getMonday(new Date()) }, { onSuccess })
    } else if (action === 'review-monthly') {
      const d = new Date()
      const monthStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
      reviewPrompt.mutate({ type: 'monthly', period_start: monthStart }, { onSuccess })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4" /> AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleAction('weekly-summary')}>
            {isPending && activeAction === 'weekly-summary' ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
            Weekly Summary
          </Button>
          <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleAction('suggest-priorities')}>
            {isPending && activeAction === 'suggest-priorities' ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
            Suggest Priorities
          </Button>
          <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleAction('review-weekly')}>
            {isPending && activeAction === 'review-weekly' ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
            Review Weekly
          </Button>
          <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleAction('review-monthly')}>
            {isPending && activeAction === 'review-monthly' ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
            Review Monthly
          </Button>
        </div>
        {result && (
          <div className="rounded-md border bg-muted/50 p-3">
            <p className="whitespace-pre-wrap text-sm">{result.content}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
