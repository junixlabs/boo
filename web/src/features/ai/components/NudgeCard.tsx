import { useNavigate } from 'react-router-dom'
import { X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BooAvatar } from './BooAvatar'
import type { Nudge } from '../types'

const priorityColor: Record<string, string> = {
  high: 'var(--nudge-high)',
  medium: 'var(--nudge-medium)',
  low: 'var(--nudge-low)',
}

export const nudgeAction: Record<string, { route: string; label: string }> = {
  no_daily_focus: { route: '/focus', label: 'Set focus' },
  overdue_tasks: { route: '/tasks', label: 'View tasks' },
  stale_project: { route: '/projects', label: 'View projects' },
  no_weekly_plan: { route: '/weekly', label: 'Create plan' },
  no_weekly_reflection: { route: '/reflections', label: 'Write reflection' },
  no_monthly_reflection: { route: '/reflections', label: 'Write reflection' },
  incomplete_focus: { route: '/focus', label: 'View focus' },
  ideas_aging: { route: '/ideas', label: 'Review ideas' },
  goal_deadline: { route: '/direction', label: 'Check goals' },
  task_due_soon: { route: '/tasks', label: 'View tasks' },
  task_stuck: { route: '/tasks', label: 'View tasks' },
  wip_overload: { route: '/tasks', label: 'View tasks' },
  no_daily_activity: { route: '/tasks', label: 'View tasks' },
  plan_tomorrow: { route: '/focus', label: 'Set focus' },
  focus_streak: { route: '/focus', label: 'View streak' },
  daily_win: { route: '/focus', label: 'View focus' },
  welcome_back: { route: '/', label: 'Dashboard' },
  overwork_warning: { route: '/settings', label: 'Settings' },
  epic_meaning: { route: '/focus', label: 'View focus' },
  milestone_progress: { route: '/projects', label: 'View milestone' },
  outcome_check: { route: '/tasks', label: 'Check outcome' },
  reflection_followup: { route: '/reflections', label: 'View reflection' },
  overcommitment: { route: '/tasks', label: 'Prioritize' },
  rest_in_peace: { route: '/projects', label: 'View project' },
  achievement_first_task: { route: '/tasks', label: 'View tasks' },
  achievement_early_bird: { route: '/focus', label: 'View focus' },
  achievement_streak_record: { route: '/focus', label: 'View streak' },
  achievement_project_closer: { route: '/projects', label: 'View project' },
  achievement_reflection_master: { route: '/reflections', label: 'View reflections' },
  pattern_insight: { route: '/ai', label: 'View insight' },
  priority_conflict: { route: '/ai', label: 'View conflict' },
}

export function NudgeCard({
  nudge,
  onDismiss,
  onAction,
}: {
  nudge: Nudge
  onDismiss: (type: string) => void
  onAction?: () => void
}) {
  const navigate = useNavigate()
  const action = nudgeAction[nudge.type]

  function handleAction() {
    if (action) {
      navigate(action.route)
      onAction?.()
    }
  }

  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-l-4 bg-card p-3"
      style={{ borderLeftColor: priorityColor[nudge.priority] }}
    >
      <BooAvatar size={28} expression={nudge.boo_expression} className="shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{nudge.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{nudge.message}</p>
        {action && (
          <button
            onClick={handleAction}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {action.label}
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={() => onDismiss(nudge.type)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}
