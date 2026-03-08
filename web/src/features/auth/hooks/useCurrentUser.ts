import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '../api/auth.api'

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.me().then((r) => r.data.data),
    enabled: !!token,
  })
}
