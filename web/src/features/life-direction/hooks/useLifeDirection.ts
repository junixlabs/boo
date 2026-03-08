import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lifeDirectionApi } from '../api/life-direction.api'
import type { VisionPayload } from '../types'

export const lifeDirectionKeys = {
  all: ['life-direction'] as const,
}

export function useLifeDirection() {
  return useQuery({
    queryKey: lifeDirectionKeys.all,
    queryFn: () => lifeDirectionApi.get().then((r) => r.data.data),
  })
}

export function useUpdateVision() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: VisionPayload) => lifeDirectionApi.updateVision(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: lifeDirectionKeys.all }),
  })
}
