import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard.api'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  today: ['dashboard', 'today'] as const,
  overview: ['dashboard', 'overview'] as const,
}

export function useDashboardToday() {
  return useQuery({
    queryKey: dashboardKeys.today,
    queryFn: () => dashboardApi.today().then((r) => r.data.data),
  })
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview,
    queryFn: () => dashboardApi.overview().then((r) => r.data.data),
  })
}
