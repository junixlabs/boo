import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/common/PageHeader'
import { PageLoading } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { IdeaCard } from '@/features/ideas/components/IdeaCard'
import { IdeaForm } from '@/features/ideas/components/IdeaForm'
import { ConvertIdeaDialog } from '@/features/ideas/components/ConvertIdeaDialog'
import { useIdeas, useCreateIdea, useDeleteIdea, useConvertIdea, useDiscardIdea } from '@/features/ideas/hooks/useIdeas'
import type { Idea, IdeaStatus } from '@/features/ideas/types'

export default function IdeasPage() {
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | 'all'>('inbox')
  const [convertIdea, setConvertIdea] = useState<Idea | null>(null)

  const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined
  const { data, isLoading } = useIdeas(filters)
  const createIdea = useCreateIdea()
  const deleteIdea = useDeleteIdea()
  const convertIdeaMutation = useConvertIdea()
  const discardIdea = useDiscardIdea()

  const ideas = data?.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader title="Ideas" description="Capture ideas, convert them later" />

      <Card>
        <CardHeader><CardTitle className="text-base">Quick Capture</CardTitle></CardHeader>
        <CardContent>
          <IdeaForm onSubmit={(d) => createIdea.mutate(d)} isPending={createIdea.isPending} />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as IdeaStatus | 'all')}>
          <SelectTrigger className="w-36"><SelectValue>{{ all: 'All', inbox: 'Inbox', converted: 'Converted', discarded: 'Discarded' }[statusFilter]}</SelectValue></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="inbox">Inbox</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="discarded">Discarded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : ideas.length === 0 ? (
        <EmptyState icon={Lightbulb} title="No ideas yet" description="Capture your first idea above" />
      ) : (
        <div className="space-y-2">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onConvert={(i) => setConvertIdea(i)}
              onDiscard={(id) => discardIdea.mutate(id)}
              onDelete={(id) => deleteIdea.mutate(id)}
            />
          ))}
        </div>
      )}

      <ConvertIdeaDialog
        idea={convertIdea}
        open={!!convertIdea}
        onOpenChange={(o) => !o && setConvertIdea(null)}
        onConvert={(id, d) => convertIdeaMutation.mutate({ id, data: d }, { onSuccess: () => setConvertIdea(null) })}
        isPending={convertIdeaMutation.isPending}
      />
    </div>
  )
}
