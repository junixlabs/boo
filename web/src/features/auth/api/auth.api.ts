import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { AuthResponse, LoginPayload, RegisterPayload, UpdateProfilePayload, User } from '../types'

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: LoginPayload) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  logout: () =>
    api.post('/auth/logout'),

  refresh: () =>
    api.post<ApiResponse<{ token: string }>>('/auth/refresh'),

  me: () =>
    api.get<ApiResponse<User>>('/auth/me'),

  updateProfile: (data: UpdateProfilePayload) =>
    api.put<ApiResponse<User>>('/auth/profile', data),
}
