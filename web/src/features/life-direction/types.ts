import type { Goal } from '@/features/goals/types'
import type { FocusArea } from '@/features/focus-areas/types'

export interface LifeDirection {
  vision: string | null
  goals: Goal[]
  focus_areas: FocusArea[]
  updated_at: string | null
}

export interface VisionPayload {
  vision: string
}
