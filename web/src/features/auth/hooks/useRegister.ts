import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '../api/auth.api'
import type { RegisterPayload } from '../types'

export function useRegister() {
  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    onSuccess: (res) => {
      setToken(res.data.data.token)
      navigate('/')
    },
  })
}
