import { DemoStateProvider, useDemoState } from './demo/state'
import { hasPerm } from './auth'
import { useRoute, routeTitle } from './router'
import { LabeledSelect } from './ui/components'
import type { Motion, TimeRange } from './types'
import { OverviewPage } from './pages/OverviewPage'
import { AcquisitionPage } from './pages/AcquisitionPage'
import { ActivationPage } from './pages/ActivationPage'
import { RetentionPage } from './pages/RetentionPage'
import { MonetizationPage } from './pages/MonetizationPage'
import { EventDictionaryPage } from './pages/EventDictionaryPage'
import { AlertsPage } from './pages/AlertsPage'
import { AdminPage } from './pages/AdminPage'

function AppInner() {
  const { route } = useRoute()
  const {
    role,
    tenants,
    tenantId,
    setTenantId,
    tenant,
    workspaceId,
    setWorkspaceId,
    motion,
    setMotion,
    timeRange,
    setTimeRange,
  } = useDemoState()

  const nav = [
    { key: 'overview', label: '总览', perm: 'view_dashboards' as const },
    { key: 'acquisition', label: '获客', perm: 'view_dashboards' as const },
    { key: 'activation', label: '激活', perm: 'view_dashboards' as const },
    { key: 'retention', label: '留存', perm: 'view_dashboards' as const },
    { key: 'monetization', label: '营收/扩席', perm: 'view_dashboards' as const },
    { key: 'events', label: '事件字典', perm: 'view_event_dictionary' as const },
    { key: 'alerts', label: '告警中心', perm: 'view_alerts' as const },
    { key: 'admin', label: '管理', perm: 'view_audit' as const },
  ]

  const routePerm = nav.find((n) => n.key === route)?.perm ?? 'view_dashboards'
  const allowed = hasPerm(role, routePerm)
  const title = routeTitle(route)

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="title">Meegle Growth Monitor</div>
          <div className="sub">workspace 维度 · seat/plan 商业化</div>
        </div>

        <div style={{ color: 'var(--muted)', fontSize: 12, padding: '0 10px' }}>
          当前角色：{role}
        </div>

        <nav className="nav">
          {nav
            .filter((n) => hasPerm(role, n.perm))
            .map((n) => (
              <a key={n.key} href={`#${n.key}`} className={route === n.key ? 'active' : ''}>
                {n.label}
              </a>
            ))}
        </nav>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="pageTitle">{title}</div>
          <div className="filters">
            <LabeledSelect
              label="Tenant"
              value={tenantId}
              options={tenants.map((t) => ({ value: t.id, label: `${t.name} (${t.region})` }))}
              onChange={(v) => setTenantId(v)}
            />
            <LabeledSelect
              label="Workspace"
              value={workspaceId}
              options={tenant.workspaces.map((w) => ({ value: w.id, label: `${w.name} · ${w.plan} · ${w.motion}` }))}
              onChange={(v) => setWorkspaceId(v)}
            />
            <LabeledSelect
              label="Motion"
              value={motion}
              options={[
                { value: '全部', label: '全部' },
                { value: 'Lark', label: 'Lark' },
                { value: '独立', label: '独立' },
              ]}
              onChange={(v) => setMotion(v as Motion | '全部')}
            />
            <LabeledSelect
              label="时间"
              value={timeRange}
              options={[
                { value: '7D', label: '近7天' },
                { value: '30D', label: '近30天' },
                { value: '90D', label: '近90天' },
              ]}
              onChange={(v) => setTimeRange(v as TimeRange)}
            />
          </div>
        </div>

        {!allowed ? (
          <section className="card">
            <div className="cardHeader">
              <div className="h">无权限</div>
              <div className="sub">role={role}</div>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              当前角色没有访问该页面的权限。可在「管理」页切换角色体验不同权限范围。
            </div>
          </section>
        ) : null}

        {allowed && route === 'overview' ? <OverviewPage /> : null}
        {allowed && route === 'acquisition' ? <AcquisitionPage /> : null}
        {allowed && route === 'activation' ? <ActivationPage /> : null}
        {allowed && route === 'retention' ? <RetentionPage /> : null}
        {allowed && route === 'monetization' ? <MonetizationPage /> : null}
        {allowed && route === 'events' ? <EventDictionaryPage /> : null}
        {allowed && route === 'alerts' ? <AlertsPage /> : null}
        {allowed && route === 'admin' ? <AdminPage /> : null}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <DemoStateProvider>
      <AppInner />
    </DemoStateProvider>
  )
}
