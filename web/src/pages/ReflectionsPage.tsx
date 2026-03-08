import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/common/PageHeader'
import { PageLoading } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { ReflectionCard } from '@/features/reflections/components/ReflectionCard'
import { ReflectionForm } from '@/features/reflections/components/ReflectionForm'
import { useReflections, useCreateReflection, useUpdateReflection, useDeleteReflection } from '@/features/reflections/hooks/useReflections'
import type { Reflection, ReflectionType } from '@/features/reflections/types'

export default function ReflectionsPage() {
  const [typeFilter, setTypeFilter] = useState<ReflectionType | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editReflection, setEditReflection] = useState<Reflection | null>(null)

  const filters = typeFilter !== 'all' ? { type: typeFilter } : undefined
  const { data, isLoading } = useReflections(filters)
  const createReflection = useCreateReflection()
  const updateReflection = useUpdateReflection()
  const deleteReflection = useDeleteReflection()

  const reflections = data?.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reflections"
        description="Weekly and monthly self-reflection"
        action={
          <Button onClick={() => { setEditReflection(null); setDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> New Reflection
          </Button>
        }
      />

      <div className="flex gap-2">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ReflectionType | 'all')}>
          <SelectTrigger className="w-36"><SelectValue>{{ all: 'All', weekly: 'Weekly', monthly: 'Monthly' }[typeFilter]}</SelectValue></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : reflections.length === 0 ? (
        <EmptyState icon={BookOpen} title="No reflections" description="Start your first reflection" />
      ) : (
        <div className="space-y-4">
          {reflections.map((r) => (
            <ReflectionCard
              key={r.id}
              reflection={r}
              onEdit={(ref) => { setEditReflection(ref); setDialogOpen(true) }}
              onDelete={(id) => deleteReflection.mutate(id)}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editReflection ? 'Edit Reflection' : 'New Reflection'}</DialogTitle></DialogHeader>
          <ReflectionForm
            initial={editReflection ?? undefined}
            onSubmit={(d) => {
              if (editReflection) {
                updateReflection.mutate({ id: editReflection.id, data: d }, { onSuccess: () => setDialogOpen(false) })
              } else {
                createReflection.mutate(d, { onSuccess: () => setDialogOpen(false) })
              }
            }}
            isPending={createReflection.isPending || updateReflection.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
