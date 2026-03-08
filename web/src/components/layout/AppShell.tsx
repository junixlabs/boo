import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, MobileSidebar } from './Sidebar'
import { Header } from './Header'
import { FloatingBoo } from '@/features/ai/components/FloatingBoo'

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="md:pl-56">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <FloatingBoo />
    </div>
  )
}
