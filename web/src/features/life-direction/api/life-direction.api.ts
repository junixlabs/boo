import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { LifeDirection, VisionPayload } from '../types'

export const lifeDirectionApi = {
  get: () =>
    api.get<ApiResponse<LifeDirection>>('/life-direction'),

  updateVision: (data: VisionPayload) =>
    api.put<ApiResponse<{ vision: string; updated_at: string }>>('/life-direction/vision', data),
}
