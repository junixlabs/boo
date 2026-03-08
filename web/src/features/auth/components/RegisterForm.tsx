import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BooAvatar } from '@/features/ai/components/BooAvatar'
import { useRegister } from '../hooks/useRegister'
import type { ApiError } from '@/types/api'
import { AxiosError } from 'axios'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const register = useRegister()

  const error = register.error as AxiosError<ApiError> | null
  const fieldErrors = error?.response?.data?.errors

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    register.mutate({ name, email, password, password_confirmation: passwordConfirmation, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="justify-items-center text-center">
        <BooAvatar size={48} expression="default" />
        <CardTitle className="text-2xl">Tạo tài khoản mới!</CardTitle>
        <CardDescription>Boo đang chờ bạn nè~</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && !fieldErrors && (
            <p className="text-sm text-destructive">{error.response?.data?.message ?? 'Registration failed'}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            {fieldErrors?.name && <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {fieldErrors?.email && <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {fieldErrors?.password && <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input id="password_confirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending ? 'Creating account...' : 'Create account'}
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary underline">Sign in</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
