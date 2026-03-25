import { useMemo } from 'react'
import { useDemoState } from '../demo/state'
import { hasPerm } from '../auth'
import { Card, LabeledSelect, Pill, formatInt } from '../ui/components'
import type { Role } from '../types'

const roles: { value: Role; label: string }[] = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Analyst', label: 'Analyst' },
  { value: 'Marketer', label: 'Marketer' },
  { value: 'Viewer', label: 'Viewer' },
]

export function AdminPage() {
  const { tenant, tenants, tenantId, setTenantId, workspaceId, setWorkspaceId, role, setRole } = useDemoState()
  const canManageMembers = hasPerm(role, 'manage_members')
  const canManageAlerts = hasPerm(role, 'manage_alerts')
  const canManageEvents = hasPerm(role, 'manage_event_dictionary')

  const workspace = useMemo(
    () => tenant.workspaces.find((w) => w.id === workspaceId) ?? tenant.workspaces[0]!,
    [tenant.workspaces, workspaceId],
  )

  return (
    <div className="grid">
      <div style={{ gridColumn: 'span 12' }}>
        <Card title="Demo 管理" subtitle="workspace/tenant 隔离 + 基础 RBAC（示例）">
          <div className="filters" style={{ marginBottom: 12 }}>
            <LabeledSelect
              label="角色"
              value={role}
              options={roles}
              onChange={(v) => setRole(v)}
            />
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
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Pill tone={canManageMembers ? 'good' : 'warn'}>成员管理：{canManageMembers ? '允许' : '只读'}</Pill>
            <Pill tone={canManageAlerts ? 'good' : 'warn'}>告警配置：{canManageAlerts ? '允许' : '只读'}</Pill>
            <Pill tone={canManageEvents ? 'good' : 'warn'}>事件字典：{canManageEvents ? '允许' : '只读'}</Pill>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 7' }}>
        <Card title="计费与席位" subtitle="按席位收费；Free ≤20；S/P 30 天试用">
          <table className="table">
            <thead>
              <tr>
                <th>层级</th>
                <th>Plan</th>
                <th>Seats</th>
                <th>Active</th>
                <th>Limit</th>
                <th>Trial</th>
                <th>Motion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tenant 总计</td>
                <td style={{ color: 'var(--muted)' }}>混合</td>
                <td>{formatInt(tenant.seats)}</td>
                <td>{formatInt(tenant.activeSeats)}</td>
                <td style={{ color: 'var(--muted)' }}>-</td>
                <td style={{ color: 'var(--muted)' }}>-</td>
                <td style={{ color: 'var(--muted)' }}>-</td>
              </tr>
              {tenant.workspaces.map((w) => (
                <tr key={w.id}>
                  <td>Workspace</td>
                  <td>{w.plan}</td>
                  <td>{formatInt(w.seats)}</td>
                  <td>{formatInt(w.activeSeats)}</td>
                  <td>{formatInt(w.seatLimit)}</td>
                  <td>{w.trialDaysLeft != null ? `${w.trialDaysLeft} days` : '-'}</td>
                  <td>{w.motion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 5' }}>
        <Card title="当前 Workspace" subtitle="用于说明：团队实体是 workspace">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <span style={{ color: 'var(--muted)' }}>Workspace：</span>
              {workspace.name}
            </div>
            <div>
              <span style={{ color: 'var(--muted)' }}>Plan：</span>
              {workspace.plan}
            </div>
            <div>
              <span style={{ color: 'var(--muted)' }}>Motion：</span>
              {workspace.motion}
            </div>
            <div>
              <span style={{ color: 'var(--muted)' }}>创建时间：</span>
              {workspace.createdAt}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
