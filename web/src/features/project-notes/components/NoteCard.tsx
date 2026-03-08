import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ProjectNote } from '../types'

interface NoteCardProps {
  note: ProjectNote
  onEdit: (note: ProjectNote) => void
  onDelete: (id: number) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border p-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{note.title}</p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-3 whitespace-pre-wrap">{note.content}</p>
        <p className="mt-1 text-xs text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(note)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(note.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
