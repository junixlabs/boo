import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { FloatingBoo } from '@/features/ai/components/FloatingBoo'

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-56">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <FloatingBoo />
    </div>
  )
}
