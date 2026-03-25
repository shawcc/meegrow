import { getAlerts } from '../demo/data'
import { useDemoState } from '../demo/state'
import { Card, Pill } from '../ui/components'

export function AlertsPage() {
  const { tenant, workspaceId, motion, timeRange } = useDemoState()
  const ctx = { tenantId: tenant.id, workspaceId, motion, timeRange }
  const alerts = getAlerts(ctx)

  return (
    <div className="grid">
      <div style={{ gridColumn: 'span 12' }}>
        <Card title="告警中心" subtitle="阈值告警 + 环比异常（示例）">
          <table className="table">
            <thead>
              <tr>
                <th>时间</th>
                <th>级别</th>
                <th>状态</th>
                <th>标题</th>
                <th>规则</th>
                <th>范围</th>
                <th>当前</th>
                <th>基线</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--muted)' }}>{a.time}</td>
                  <td>
                    <Pill tone={a.severity === '高' ? 'bad' : a.severity === '中' ? 'warn' : 'good'}>
                      {a.severity}
                    </Pill>
                  </td>
                  <td>{a.status}</td>
                  <td>{a.title}</td>
                  <td style={{ color: 'var(--muted)' }}>{a.rule}</td>
                  <td style={{ color: 'var(--muted)' }}>{a.scope}</td>
                  <td>{a.currentValue}</td>
                  <td>{a.baseline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
