import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getDemoTenants } from './data'
import type { Motion, Role, Tenant, TimeRange } from '../types'

type DemoState = {
  role: Role
  setRole: (r: Role) => void
  tenantId: string
  setTenantId: (id: string) => void
  workspaceId: string
  setWorkspaceId: (id: string) => void
  motion: Motion | '全部'
  setMotion: (m: Motion | '全部') => void
  timeRange: TimeRange
  setTimeRange: (t: TimeRange) => void
  tenant: Tenant
  workspaceName: string
  currency: string
  tenants: Tenant[]
}

const Ctx = createContext<DemoState | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    if (!v) return fallback
    return JSON.parse(v) as T
  } catch {
    return fallback
  }
}

function save<T>(key: string, v: T) {
  localStorage.setItem(key, JSON.stringify(v))
}

export function DemoStateProvider(props: { children: ReactNode }) {
  const tenants = useMemo(() => getDemoTenants(), [])
  const [role, setRoleState] = useState<Role>(() => load<Role>('demo_role', 'Analyst'))
  const [tenantId, setTenantIdState] = useState(() => load<string>('demo_tenant', tenants[0]!.id))
  const tenant = tenants.find((t) => t.id === tenantId) ?? tenants[0]!
  const [workspaceId, setWorkspaceIdState] = useState(() => load<string>('demo_workspace', tenant.workspaces[0]!.id))
  const workspace = tenant.workspaces.find((w) => w.id === workspaceId) ?? tenant.workspaces[0]!
  const [motion, setMotionState] = useState<Motion | '全部'>(() => load<Motion | '全部'>('demo_motion', '全部'))
  const [timeRange, setTimeRangeState] = useState<TimeRange>(() => load<TimeRange>('demo_range', '30D'))

  const setRole = (r: Role) => {
    setRoleState(r)
    save('demo_role', r)
  }

  const setTenantId = (id: string) => {
    setTenantIdState(id)
    save('demo_tenant', id)
    const nextTenant = tenants.find((t) => t.id === id)
    const nextWorkspaceId = nextTenant?.workspaces[0]?.id
    if (nextWorkspaceId) {
      setWorkspaceIdState(nextWorkspaceId)
      save('demo_workspace', nextWorkspaceId)
    }
  }

  const setWorkspaceId = (id: string) => {
    setWorkspaceIdState(id)
    save('demo_workspace', id)
  }

  const setMotion = (m: Motion | '全部') => {
    setMotionState(m)
    save('demo_motion', m)
  }

  const setTimeRange = (t: TimeRange) => {
    setTimeRangeState(t)
    save('demo_range', t)
  }

  const value: DemoState = {
    role,
    setRole,
    tenantId,
    setTenantId,
    workspaceId,
    setWorkspaceId,
    motion,
    setMotion,
    timeRange,
    setTimeRange,
    tenant,
    workspaceName: workspace.name,
    currency: tenant.currency,
    tenants,
  }

  return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>
}

export function useDemoState() {
  const v = useContext(Ctx)
  if (!v) throw new Error('DemoStateProvider missing')
  return v
}
