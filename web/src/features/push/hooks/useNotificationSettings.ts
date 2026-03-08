import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pushApi } from '../api/push.api'

export function useNotificationSettings() {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: () => pushApi.getSettings().then((r) => r.data.data),
  })
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: pushApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] })
    },
  })
}
