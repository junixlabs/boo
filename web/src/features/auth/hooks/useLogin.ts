import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '../api/auth.api'
import type { LoginPayload } from '../types'

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (res) => {
      setToken(res.data.data.token)
      navigate('/')
    },
  })
}
