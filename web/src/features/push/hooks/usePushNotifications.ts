import { useCallback, useEffect, useState } from 'react'
import { pushApi } from '../api/push.api'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) {
    output[i] = raw.charCodeAt(i)
  }
  return output
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const checkSubscription = useCallback(async () => {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    setIsSubscribed(!!sub)
  }, [])

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window
    setIsSupported(supported)
    if (supported) {
      checkSubscription()
    }
  }, [checkSubscription])

  const subscribe = useCallback(async () => {
    setIsPending(true)
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready
      const { data } = await pushApi.getVapidKey()
      const applicationServerKey = urlBase64ToUint8Array(data.data.public_key)
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })
      await pushApi.subscribe(sub.toJSON())
      setIsSubscribed(true)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setPermissionDenied(true)
      }
      throw err
    } finally {
      setIsPending(false)
    }
  }, [])

  const unsubscribe = useCallback(async () => {
    setIsPending(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        const endpoint = sub.endpoint
        await sub.unsubscribe()
        await pushApi.unsubscribe({ endpoint })
      }
      setIsSubscribed(false)
    } finally {
      setIsPending(false)
    }
  }, [])

  return { isSupported, isSubscribed, isPending, permissionDenied, subscribe, unsubscribe }
}
