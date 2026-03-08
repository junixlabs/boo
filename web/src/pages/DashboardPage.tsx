import { PageHeader } from '@/components/common/PageHeader'
import { PageLoading } from '@/components/common/LoadingSpinner'
import { DashboardView } from '@/features/dashboard/components/DashboardView'
import { useDashboardToday, useDashboardOverview } from '@/features/dashboard/hooks/useDashboardToday'

export default function DashboardPage() {
  const { data, isLoading } = useDashboardToday()
  const { data: overview } = useDashboardOverview()

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Your day at a glance" />
      {isLoading ? <PageLoading /> : data && <DashboardView data={data} overview={overview} />}
    </div>
  )
}
