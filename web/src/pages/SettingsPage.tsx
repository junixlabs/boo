import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import api from '@/lib/axios'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { usePushNotifications } from '@/features/push/hooks/usePushNotifications'
import { useNotificationSettings, useUpdateNotificationSettings } from '@/features/push/hooks/useNotificationSettings'

export default function SettingsPage() {
  const { data: user } = useCurrentUser()
  const { data: timezones = [] } = useQuery({
    queryKey: ['timezones'],
    queryFn: () => api.get<string[]>('/timezones').then((r) => r.data),
    staleTime: Infinity,
  })
  const updateProfile = useUpdateProfile()
  const logout = useLogout()
  const { theme, setTheme } = useTheme()
  const { isSupported, isSubscribed, isPending, permissionDenied, subscribe, unsubscribe } = usePushNotifications()
  const { data: settings } = useNotificationSettings()
  const updateSettings = useUpdateNotificationSettings()

  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('')
  const [tzSearch, setTzSearch] = useState('')
  const [tzOpen, setTzOpen] = useState(false)
  const tzRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setTimezone(user.timezone)
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tzRef.current && !tzRef.current.contains(e.target as Node)) {
        setTzOpen(false)
        setTzSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredTimezones = tzSearch
    ? timezones.filter((tz) => tz.toLowerCase().includes(tzSearch.toLowerCase().replace(/ /g, '_')))
    : timezones

  const hasChanges = user && (name !== user.name || timezone !== user.timezone)

  const handleSave = () => {
    updateProfile.mutate({ name, timezone })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2" ref={tzRef}>
            <Label>Timezone</Label>
            <Input
              value={tzOpen ? tzSearch : timezone}
              placeholder="Search timezone..."
              onChange={(e) => { setTzSearch(e.target.value); setTzOpen(true) }}
              onFocus={() => setTzOpen(true)}
            />
            {tzOpen && (
              <div className="max-h-48 overflow-auto rounded-md border bg-popover shadow-md">
                {filteredTimezones.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
                ) : (
                  filteredTimezones.map((tz) => (
                    <div
                      key={tz}
                      className={`cursor-pointer px-3 py-1.5 text-sm hover:bg-accent ${tz === timezone ? 'bg-accent font-medium' : ''}`}
                      onClick={() => { setTimezone(tz); setTzOpen(false); setTzSearch('') }}
                    >
                      {tz}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Saving...' : 'Save'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Receive push notifications from Boo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSupported ? (
            <p className="text-sm text-muted-foreground">Browser does not support push notifications</p>
          ) : permissionDenied ? (
            <p className="text-sm text-muted-foreground">Notification permission was denied. Please enable it in browser settings</p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-toggle">Push Notifications</Label>
                <Switch
                  id="push-toggle"
                  checked={isSubscribed}
                  onCheckedChange={(checked) => checked ? subscribe() : unsubscribe()}
                  disabled={isPending}
                />
              </div>
              {isSubscribed && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="morning-time">Morning reminder</Label>
                    <input
                      id="morning-time"
                      type="time"
                      className="rounded-md border bg-background px-2 py-1 text-sm"
                      defaultValue={settings?.morning_time ?? ''}
                      key={`morning-${settings?.morning_time}`}
                      onBlur={(e) => updateSettings.mutate({ morning_time: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="evening-time">Evening reminder</Label>
                    <input
                      id="evening-time"
                      type="time"
                      className="rounded-md border bg-background px-2 py-1 text-sm"
                      defaultValue={settings?.evening_time ?? ''}
                      key={`evening-${settings?.evening_time}`}
                      onBlur={(e) => updateSettings.mutate({ evening_time: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Boo will send you reminders at the configured times</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ''} disabled />
          </div>
          <Button
            variant="destructive"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
