import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ArrowRightLeft, Trash2, XCircle } from 'lucide-react'
import type { Idea } from '../types'

interface IdeaCardProps {
  idea: Idea
  onConvert: (idea: Idea) => void
  onDiscard: (id: number) => void
  onDelete: (id: number) => void
}

export function IdeaCard({ idea, onConvert, onDiscard, onDelete }: IdeaCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border p-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{idea.title}</p>
        {idea.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{idea.description}</p>}
        <div className="mt-2 flex items-center gap-2">
          {idea.category && <Badge variant="outline" className="text-xs">{idea.category}</Badge>}
          <span className="text-xs text-muted-foreground">{new Date(idea.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      {idea.status === 'inbox' && (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onConvert(idea)}>
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Convert
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDiscard(idea.id)}>
              <XCircle className="mr-2 h-4 w-4" /> Discard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(idea.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {idea.status !== 'inbox' && (
        <Badge variant="secondary">{{ inbox: 'Inbox', converted: 'Converted', discarded: 'Discarded' }[idea.status] ?? idea.status}</Badge>
      )}
    </div>
  )
}
