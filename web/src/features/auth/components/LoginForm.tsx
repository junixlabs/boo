import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BooAvatar } from '@/features/ai/components/BooAvatar'
import { useLogin } from '../hooks/useLogin'
import type { ApiError } from '@/types/api'
import { AxiosError } from 'axios'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()

  const error = login.error as AxiosError<ApiError> | null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate({ email, password })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="justify-items-center text-center">
        <BooAvatar size={48} expression="happy" />
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
        <CardDescription>Đăng nhập để gặp lại Boo nha~</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive">
              {error.response?.data?.message ?? 'Login failed'}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
          <p className="text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary underline">Register</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
