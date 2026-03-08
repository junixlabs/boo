import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Target,
  Lightbulb,
  Compass,
  CalendarRange,
  GraduationCap,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { BooAvatar } from '@/features/ai/components/BooAvatar'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/focus', icon: Target, label: 'Daily Focus' },
  { to: '/ideas', icon: Lightbulb, label: 'Ideas' },
  { to: '/direction', icon: Compass, label: 'Life Direction' },
  { to: '/weekly', icon: CalendarRange, label: 'Weekly Plan' },
  { to: '/skills', icon: GraduationCap, label: 'Skills' },
  { to: '/reflections', icon: BookOpen, label: 'Reflections' },
  { to: '/ai', icon: Sparkles, label: 'AI Assistant' },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r bg-card">
      <div className="flex h-14 items-center gap-2.5 border-b px-4">
        <BooAvatar size={28} expression="default" />
        <span className="text-lg font-bold text-primary">Boo</span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
