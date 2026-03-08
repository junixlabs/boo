export interface User {
  id: number
  name: string
  email: string
  timezone: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  timezone?: string
}

export interface AuthResponse {
  user: User
  token: string
  token_type: string
  expires_in: number
}

export interface UpdateProfilePayload {
  name?: string
  timezone?: string
}
