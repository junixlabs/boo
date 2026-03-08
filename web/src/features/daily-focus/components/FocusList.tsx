import { useState, useRef } from 'react'
import { Target, X, GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import type { DailyFocus } from '../types'

interface FocusListProps {
  focuses: DailyFocus[]
  onRemove: (id: number) => void
  onReorder?: (order: number[]) => void
}

export function FocusList({ focuses, onRemove, onReorder }: FocusListProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const dragNode = useRef<HTMLDivElement | null>(null)

  if (focuses.length === 0) {
    return <EmptyState icon={Target} title="No focus set" description="Pick up to 3 tasks to focus on today" />
  }

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, idx: number) {
    setDragIdx(idx)
    dragNode.current = e.currentTarget
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (idx !== overIdx) setOverIdx(idx)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, idx: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx || !onReorder) return
    const reordered = [...focuses]
    const [moved] = reordered.splice(dragIdx, 1)
    reordered.splice(idx, 0, moved)
    onReorder(reordered.map((f) => f.id))
  }

  function handleDragEnd() {
    setDragIdx(null)
    setOverIdx(null)
    dragNode.current = null
  }

  return (
    <div className="space-y-2">
      {focuses.map((f, idx) => (
        <div
          key={f.id}
          draggable={!!onReorder}
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={(e) => handleDrop(e, idx)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-3 rounded-md border p-3 transition-colors ${
            dragIdx === idx ? 'opacity-40' : ''
          } ${overIdx === idx && dragIdx !== idx ? 'border-primary bg-primary/5' : ''} ${
            onReorder ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
        >
          {onReorder && (
            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {idx + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{f.task.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">{{ todo: 'To Do', in_progress: 'In Progress', done: 'Done', cancelled: 'Cancelled' }[f.task.status] ?? f.task.status}</Badge>
              {f.task.project && <span className="text-xs text-muted-foreground">{f.task.project.title}</span>}
            </div>
            {f.note && <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(f.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
