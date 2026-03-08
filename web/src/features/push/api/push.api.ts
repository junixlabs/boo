import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

interface NotificationSettings {
  id: number
  push_enabled: boolean
  morning_time: string
  evening_time: string
  gentle_mode: boolean
  quiet_hours_start: string | null
  quiet_hours_end: string | null
  weekend_mode: boolean
}

export const pushApi = {
  getVapidKey: () =>
    api.get<ApiResponse<{ public_key: string }>>('/push-subscriptions/key'),

  subscribe: (data: PushSubscriptionJSON) =>
    api.post('/push-subscriptions', data),

  unsubscribe: (data: { endpoint: string }) =>
    api.delete('/push-subscriptions', { data }),

  getSettings: () =>
    api.get<ApiResponse<NotificationSettings>>('/notification-settings'),

  updateSettings: (data: Partial<Omit<NotificationSettings, 'id'>>) =>
    api.put<ApiResponse<NotificationSettings>>('/notification-settings', data),
}
