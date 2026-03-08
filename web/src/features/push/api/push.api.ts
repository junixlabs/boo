import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

interface NotificationSettings {
  id: number
  push_enabled: boolean
  morning_time: string
  evening_time: string
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

  updateSettings: (data: Partial<Pick<NotificationSettings, 'push_enabled' | 'morning_time' | 'evening_time'>>) =>
    api.put<ApiResponse<NotificationSettings>>('/notification-settings', data),
}
