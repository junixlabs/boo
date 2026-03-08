import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import type { DailyFocusPayload } from '../types'

interface AddFocusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: DailyFocusPayload) => void
  currentCount: number
  focusDate: string
  isPending?: boolean
}

export function AddFocusDialog({ open, onOpenChange, onAdd, currentCount, focusDate, isPending }: AddFocusDialogProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const { data: tasksData } = useTasks({ status: 'todo,in_progress', per_page: 50 })
  const tasks = tasksData?.data ?? []

  function handleAdd() {
    if (!selectedTaskId) return
    onAdd({
      task_id: selectedTaskId,
      focus_date: focusDate,
      sort_order: currentCount + 1,
      note: note || null,
    })
    setSelectedTaskId(null)
    setNote('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Focus ({currentCount}/3)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="max-h-60 space-y-1 overflow-y-auto">
            {tasks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTaskId(t.id)}
                className={`w-full rounded-md border p-2 text-left text-sm transition-colors ${selectedTaskId === t.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'}`}
              >
                <p className="font-medium">{t.title}</p>
                {t.project && <p className="text-xs text-muted-foreground">{t.project.title}</p>}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Quick context..." />
          </div>
          <Button onClick={handleAdd} className="w-full" disabled={!selectedTaskId || isPending}>
            {isPending ? 'Adding...' : 'Add to Focus'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
