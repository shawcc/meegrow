import { useEffect, useMemo, useState } from 'react'

export type RouteKey =
  | 'overview'
  | 'acquisition'
  | 'activation'
  | 'retention'
  | 'monetization'
  | 'events'
  | 'alerts'
  | 'admin'

function parseHash(): RouteKey {
  const h = window.location.hash.replace('#', '').trim()
  const key = (h || 'overview') as RouteKey
  const allowed: RouteKey[] = [
    'overview',
    'acquisition',
    'activation',
    'retention',
    'monetization',
    'events',
    'alerts',
    'admin',
  ]
  return allowed.includes(key) ? key : 'overview'
}

export function useRoute() {
  const [route, setRoute] = useState<RouteKey>(() => parseHash())
  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const set = (r: RouteKey) => {
    window.location.hash = r
  }

  return useMemo(() => ({ route, setRoute: set }), [route])
}

export function routeTitle(r: RouteKey) {
  const map: Record<RouteKey, string> = {
    overview: '总览',
    acquisition: '获客',
    activation: '激活',
    retention: '留存',
    monetization: '营收/扩席',
    events: '事件字典',
    alerts: '告警中心',
    admin: '管理',
  }
  return map[r]
}
