import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface VisionEditorProps {
  vision: string | null
  onSave: (vision: string) => void
  isPending?: boolean
}

export function VisionEditor({ vision, onSave, isPending }: VisionEditorProps) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(vision ?? '')

  function handleSave() {
    onSave(text)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Describe your life vision..."
          autoFocus
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isPending || !text.trim()}>
            <Check className="mr-1 h-3.5 w-3.5" /> Save
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setEditing(false); setText(vision ?? '') }}>
            <X className="mr-1 h-3.5 w-3.5" /> Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative">
      {vision ? (
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{vision}</p>
      ) : (
        <p className="text-sm italic text-muted-foreground">No vision set yet. Click edit to add one.</p>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-1 -top-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setEditing(true)}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
