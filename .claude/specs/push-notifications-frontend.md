# Push Notifications — Frontend Spec

## Overview

Backend push notification da COMPLETE. Frontend can implement:
1. Service Worker nhan push events
2. Subscription management (register, save, remove)
3. UI toggle trong Settings page

## Backend API (da co)

```
GET    /api/v1/push-subscriptions/key  → { data: { public_key: string } }
POST   /api/v1/push-subscriptions      → { data: { subscribed: true } }
DELETE  /api/v1/push-subscriptions      → { data: { unsubscribed: true } }
```

POST body (from browser PushSubscription.toJSON()):
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": { "p256dh": "...", "auth": "..." },
  "content_encoding": "aesgcm"
}
```

DELETE body:
```json
{ "endpoint": "https://fcm.googleapis.com/fcm/send/..." }
```

Push notification payload (from Service Worker push event):
```json
{
  "title": "Set Daily Focus",
  "body": "Boo thay hom nay ban chua set focus ne~",
  "icon": "/boo-icon.png",
  "data": {
    "type": "no_daily_focus",
    "priority": "high",
    "boo_expression": "default",
    "data": null
  }
}
```

## Implementation

### File 1: Service Worker — `web/public/sw.js`

Static file, served at root.

```
push event:
  - Parse event.data.json()
  - showNotification(title, { body, icon, data })

notificationclick event:
  - Close notification
  - Focus or open app window
  - Navigate based on data.type:
    - no_daily_focus, incomplete_focus → /focus
    - overdue_tasks → /tasks
    - no_weekly_plan → /weekly
    - no_weekly_reflection, no_monthly_reflection → /reflections
    - stale_project → /projects
    - goal_deadline → /direction
    - ideas_aging → /ideas
    - pattern_insight, priority_conflict → /ai
    - default → /
```

### File 2: API layer — `web/src/features/push/api/push.api.ts`

Pattern: same as other features, uses `@/lib/axios`.

```ts
pushApi.getVapidKey()   → GET  /push-subscriptions/key
pushApi.subscribe(body) → POST /push-subscriptions
pushApi.unsubscribe(body) → DELETE /push-subscriptions
```

### File 3: Hook — `web/src/features/push/hooks/usePushNotifications.ts`

Single hook that manages the full lifecycle.

State:
- `isSupported`: browser supports Push API + Service Worker
- `isSubscribed`: has active PushSubscription
- `isPending`: loading state during subscribe/unsubscribe

Functions:
- `subscribe()`:
  1. `navigator.serviceWorker.register('/sw.js')`
  2. Wait for `navigator.serviceWorker.ready`
  3. Fetch VAPID key from `pushApi.getVapidKey()`
  4. `reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })`
  5. `pushApi.subscribe(subscription.toJSON())` — save to backend
- `unsubscribe()`:
  1. Get existing subscription via `reg.pushManager.getSubscription()`
  2. `subscription.unsubscribe()`
  3. `pushApi.unsubscribe({ endpoint })` — remove from backend
- `checkSubscription()`:
  1. Get service worker registration
  2. `reg.pushManager.getSubscription()` — returns null if not subscribed

Helper (inline in hook):
```ts
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
```

### File 4: UI — modify `web/src/pages/SettingsPage.tsx`

Add a "Notifications" Card between "Appearance" and "Account" cards.

```
Card: Notifications
  CardTitle: "Notifications"
  CardDescription: "Receive push notifications from Boo"
  CardContent:
    - If !isSupported → text "Browser does not support push notifications"
    - If isSupported:
      - Switch/Toggle: "Push Notifications" with isSubscribed state
      - Toggle on → call subscribe()
      - Toggle off → call unsubscribe()
      - Description text: "Boo will remind you at 8:00 and 18:00 daily"
```

Use existing Shadcn Switch component. No new page or route needed.

## File Summary

| Action | Path |
|--------|------|
| New | `web/public/sw.js` |
| New | `web/src/features/push/api/push.api.ts` |
| New | `web/src/features/push/hooks/usePushNotifications.ts` |
| Modify | `web/src/pages/SettingsPage.tsx` — add Notifications card |

3 new files, 1 modified file.

## Important Notes

- Service Worker MUST be at root `/sw.js` (not in /src/) for scope to cover entire app
- `applicationServerKey` needs base64url → Uint8Array conversion
- Notification permission is requested automatically by `pushManager.subscribe()`
- If user denies permission, `subscribe()` will throw — catch and show message
- No need for Zustand store — subscription state comes from `pushManager.getSubscription()`
- No TanStack Query needed — this is imperative browser API, not server state

## Verification

1. Open Settings → see Notifications card with toggle OFF
2. Toggle ON → browser asks notification permission → accept → toggle shows ON
3. Check DB: `push_subscriptions` table has 1 row
4. Run `php artisan push:send` → browser shows notification
5. Click notification → opens app at correct page
6. Toggle OFF → subscription removed from browser + DB
7. Refresh page → toggle stays OFF (reads from pushManager)
