import { LogOut, User, Moon, Sun, Settings, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLogout } from '@/features/auth/hooks/useLogout'

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: user } = useCurrentUser()
  const logout = useLogout()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-card px-4 md:justify-end md:px-6">
      {/* Hamburger — mobile only */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-8 w-8"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent md:px-3">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">
                {user?.name?.charAt(0).toUpperCase() ?? <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm sm:inline">{user?.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout.mutate()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
