import { Card, CardContent } from '@/components/ui/card'
import { Flame, Trophy } from 'lucide-react'
import type { StreakData } from '@/features/ai/types'

export function StreakCard({ streak }: { streak: StreakData }) {
  const progress = streak.today_focus_total > 0
    ? Math.round((streak.today_focus_done / streak.today_focus_total) * 100)
    : 0

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Flame className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{streak.current_streak}</span>
              <span className="text-xs text-muted-foreground">ngày liên tiếp</span>
            </div>
            {streak.today_focus_total > 0 && (
              <div className="mt-2">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Today's focus</span>
                  <span>{streak.today_focus_done}/{streak.today_focus_total}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {streak.longest_streak > 0 && (
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Trophy className="h-3 w-3" />
            <span>Longest: {streak.longest_streak} ngày</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
