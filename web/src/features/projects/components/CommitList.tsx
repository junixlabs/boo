import { GitCommit as GitCommitIcon } from 'lucide-react'
import type { GitCommit } from '@/features/ai/types'

export function CommitList({ commits }: { commits: GitCommit[] }) {
  if (commits.length === 0) {
    return <p className="text-sm text-muted-foreground">No commits found</p>
  }

  return (
    <div className="space-y-2">
      {commits.map((c) => (
        <div key={c.sha} className="flex items-start gap-3 text-sm">
          <GitCommitIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate">{c.message}</p>
            <p className="text-xs text-muted-foreground">
              <code className="font-mono">{c.sha.slice(0, 7)}</code>
              {' · '}{c.author}{' · '}{new Date(c.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
