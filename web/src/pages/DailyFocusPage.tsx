import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/PageHeader'
import { PageLoading } from '@/components/common/LoadingSpinner'
import { FocusList } from '@/features/daily-focus/components/FocusList'
import { AddFocusDialog } from '@/features/daily-focus/components/AddFocusDialog'
import { useDailyFocus, useAddFocus, useDeleteFocus, useReorderFocus } from '@/features/daily-focus/hooks/useDailyFocus'

function todayDate() {
  return new Date().toISOString().split('T')[0]
}

export default function DailyFocusPage() {
  const today = todayDate()
  const { data: focuses, isLoading } = useDailyFocus(today)
  const addFocus = useAddFocus()
  const deleteFocus = useDeleteFocus()
  const reorderFocus = useReorderFocus()
  const [addOpen, setAddOpen] = useState(false)

  const currentCount = focuses?.length ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Focus"
        description={`Rule of 3 — Pick your top priorities for today (${today})`}
        action={
          currentCount < 3 ? (
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Focus
            </Button>
          ) : undefined
        }
      />
      {isLoading ? (
        <PageLoading />
      ) : (
        <FocusList
          focuses={focuses ?? []}
          onRemove={(id) => deleteFocus.mutate(id)}
          onReorder={(order) => reorderFocus.mutate({ focus_date: today, order })}
        />
      )}
      <AddFocusDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        currentCount={currentCount}
        focusDate={today}
        onAdd={(d) => addFocus.mutate(d, { onSuccess: () => setAddOpen(false) })}
        isPending={addFocus.isPending}
      />
    </div>
  )
}
