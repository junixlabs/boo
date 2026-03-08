import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { DashboardToday } from '../types'
import type { DashboardOverview } from '@/features/ai/types'

export const dashboardApi = {
  today: () =>
    api.get<ApiResponse<DashboardToday>>('/dashboard/today'),

  overview: () =>
    api.get<ApiResponse<DashboardOverview>>('/dashboard/overview'),
}
