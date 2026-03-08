self.addEventListener('push', (event) => {
  const payload = event.data?.json() ?? {}
  const { title = 'LifeStack', body, icon, data } = payload
  event.waitUntil(
    self.registration.showNotification(title, { body, icon: icon || '/boo-icon.png', data })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const type = event.notification.data?.type
  const urlMap = {
    no_daily_focus: '/focus',
    incomplete_focus: '/focus',
    overdue_tasks: '/tasks',
    no_weekly_plan: '/weekly',
    no_weekly_reflection: '/reflections',
    no_monthly_reflection: '/reflections',
    stale_project: '/projects',
    goal_deadline: '/direction',
    ideas_aging: '/ideas',
    pattern_insight: '/ai',
    priority_conflict: '/ai',
    task_due_soon: '/tasks',
    task_stuck: '/tasks',
    wip_overload: '/tasks',
    no_daily_activity: '/tasks',
    plan_tomorrow: '/focus',
    focus_streak: '/focus',
    daily_win: '/focus',
    welcome_back: '/',
    overwork_warning: '/settings',
    epic_meaning: '/focus',
    milestone_progress: '/projects',
    outcome_check: '/tasks',
    reflection_followup: '/reflections',
    overcommitment: '/tasks',
    rest_in_peace: '/projects',
    achievement_first_task: '/tasks',
    achievement_early_bird: '/focus',
    achievement_streak_record: '/focus',
    achievement_project_closer: '/projects',
    achievement_reflection_master: '/reflections',
  }
  const url = urlMap[type] || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      return clients.openWindow(url)
    })
  )
})
