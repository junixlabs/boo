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
