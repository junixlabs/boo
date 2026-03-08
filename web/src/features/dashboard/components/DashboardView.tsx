import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, FolderKanban, AlertTriangle, Lightbulb, CheckCircle2, Activity, GraduationCap } from 'lucide-react'
import { ProjectHealthCard } from './ProjectHealthCard'
import type { DashboardToday } from '../types'
import type { DashboardOverview } from '@/features/ai/types'

export function DashboardView({ data, overview }: { data: DashboardToday; overview?: DashboardOverview | null }) {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Target} label="Today's Focus" value={data.daily_focuses.length} suffix="/3" />
        <StatCard icon={FolderKanban} label="Active Projects" value={data.active_projects.length} />
        <StatCard icon={AlertTriangle} label="Overdue Tasks" value={data.overdue_tasks.length} variant={data.overdue_tasks.length > 0 ? 'warning' : 'default'} />
        <StatCard icon={CheckCircle2} label="Done This Week" value={data.tasks_completed_this_week} />
      </div>

      {/* Overview row - weekly goals + skill progress */}
      {overview && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overview.weekly_goals.completed}/{overview.weekly_goals.total}</p>
                <p className="text-xs text-muted-foreground">Weekly Goals</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overview.skill_progress.length}</p>
                <p className="text-xs text-muted-foreground">Skills in Progress</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Project Health */}
      {overview && overview.project_health.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Project Health</CardTitle>
            <Link to="/projects" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overview.project_health.map((p) => (
                <ProjectHealthCard key={p.id} project={p} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Focus */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Daily Focus</CardTitle>
            <Link to="/focus" className="text-sm text-primary hover:underline">Manage</Link>
          </CardHeader>
          <CardContent>
            {data.daily_focuses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No focus set for today</p>
            ) : (
              <div className="space-y-2">
                {data.daily_focuses.map((f) => (
                  <div key={f.id} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {f.sort_order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{f.task.title}</p>
                      {f.task.project && <p className="text-xs text-muted-foreground">{f.task.project.title}</p>}
                    </div>
                    <Badge variant="outline" className="text-xs">{{ todo: 'To Do', in_progress: 'In Progress', done: 'Done', cancelled: 'Cancelled' }[f.task.status] ?? f.task.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Overdue Tasks</CardTitle>
            <Link to="/tasks" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {data.overdue_tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overdue tasks</p>
            ) : (
              <div className="space-y-2">
                {data.overdue_tasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p>{t.title}</p>
                      {t.project && <p className="text-xs text-muted-foreground">{t.project.title}</p>}
                    </div>
                    <Badge variant="destructive" className="text-xs">{t.due_date}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-medium">Active Projects</CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{data.recent_ideas_count} ideas</span>
            </div>
            <Link to="/projects" className="text-sm text-primary hover:underline">View all</Link>
          </div>
        </CardHeader>
        <CardContent>
          {data.active_projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active projects</p>
          ) : (
            <div className="space-y-3">
              {data.active_projects.map((p) => {
                const progress = p.tasks_count > 0 ? Math.round((p.tasks_done_count / p.tasks_count) * 100) : 0
                return (
                  <Link key={p.id} to={`/projects/${p.id}`} className="block">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{p.title}</span>
                      <span className="text-muted-foreground">{p.tasks_done_count}/{p.tasks_count} tasks</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
                      <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, suffix, variant }: {
  icon: typeof Target; label: string; value: number; suffix?: string; variant?: 'default' | 'warning'
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`rounded-md p-2 ${variant === 'warning' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}{suffix}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
