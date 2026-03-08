import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ProjectsPage from '@/pages/ProjectsPage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import TasksPage from '@/pages/TasksPage'
import DailyFocusPage from '@/pages/DailyFocusPage'
import IdeasPage from '@/pages/IdeasPage'
import LifeDirectionPage from '@/pages/LifeDirectionPage'
import WeeklyPlanPage from '@/pages/WeeklyPlanPage'
import SkillsPage from '@/pages/SkillsPage'
import ReflectionsPage from '@/pages/ReflectionsPage'
import AiPage from '@/pages/AiPage'
import SettingsPage from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/projects', element: <ProjectsPage /> },
          { path: '/projects/:id', element: <ProjectDetailPage /> },
          { path: '/tasks', element: <TasksPage /> },
          { path: '/focus', element: <DailyFocusPage /> },
          { path: '/ideas', element: <IdeasPage /> },
          { path: '/direction', element: <LifeDirectionPage /> },
          { path: '/weekly', element: <WeeklyPlanPage /> },
          { path: '/skills', element: <SkillsPage /> },
          { path: '/reflections', element: <ReflectionsPage /> },
          { path: '/ai', element: <AiPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
