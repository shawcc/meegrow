import { getAlerts, getOverviewSeries } from '../demo/data'
import { useDemoState } from '../demo/state'
import { MetricDefinitions } from '../demo/definitions'
import { Card, Pill, Spark, formatInt } from '../ui/components'

export function OverviewPage() {
  const { tenant, workspaceId, workspaceName, motion, timeRange } = useDemoState()
  const ctx = { tenantId: tenant.id, workspaceId, motion, timeRange }
  const { wac, was, activation } = getOverviewSeries(ctx)
  const alerts = getAlerts(ctx).slice(0, 3)

  const last = (series: { values: { value: number }[] }) => series.values[series.values.length - 1]?.value ?? 0

  return (
    <div className="grid">
      <div style={{ gridColumn: 'span 12' }} className="card">
        <div className="cardHeader">
          <div className="h">Meegle 海外增长监测 Demo</div>
          <div className="sub">
            tenant={tenant.name} · workspace={workspaceName} · motion={motion} · range={timeRange}
          </div>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>
          北极星建议：WAC-T（每周活跃协作工作区） + 镜像北极星 WAS（每周活跃席位）。
        </div>
      </div>

      <div style={{ gridColumn: 'span 4' }}>
        <Card title="WAC-T" subtitle="每周活跃协作工作区">
          <div className="kpi">{formatInt(last(wac))}</div>
          <div className="kpiMeta">定义：7天内同一 workspace ≥3 人发生有效协作事件</div>
          <Spark series={wac} />
        </Card>
      </div>

      <div style={{ gridColumn: 'span 4' }}>
        <Card title="WAS" subtitle="每周活跃席位">
          <div className="kpi">{formatInt(last(was))}</div>
          <div className="kpiMeta">商业化镜像：活跃席位增长通常领先扩席/升级</div>
          <Spark series={was} />
        </Card>
      </div>

      <div style={{ gridColumn: 'span 4' }}>
        <Card title="Activated Users" subtitle="激活用户数">
          <div className="kpi">{formatInt(last(activation))}</div>
          <div className="kpiMeta">用于串联获客→激活→留存与试用转付费</div>
          <Spark series={activation} />
        </Card>
      </div>

      <div style={{ gridColumn: 'span 12' }}>
        <Card title="今日异常" subtitle="示例告警：阈值 + 环比异常">
          <table className="table">
            <thead>
              <tr>
                <th>级别</th>
                <th>标题</th>
                <th>范围</th>
                <th>当前</th>
                <th>基线</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Pill tone={a.severity === '高' ? 'bad' : a.severity === '中' ? 'warn' : 'good'}>
                      {a.severity}
                    </Pill>
                  </td>
                  <td>{a.title}</td>
                  <td>{a.scope}</td>
                  <td>{a.currentValue}</td>
                  <td>{a.baseline}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 12' }}>
        <Card title="指标口径（可追溯）" subtitle="每个指标绑定公式、事件与维度">
          <table className="table">
            <thead>
              <tr>
                <th>指标</th>
                <th>说明</th>
                <th>公式</th>
                <th>事件来源</th>
              </tr>
            </thead>
            <tbody>
              {MetricDefinitions.map((m) => (
                <tr key={m.key}>
                  <td>{m.name}</td>
                  <td style={{ color: 'var(--muted)' }}>{m.description}</td>
                  <td style={{ color: 'var(--muted)' }}>{m.formula}</td>
                  <td style={{ color: 'var(--muted)' }}>{m.sourceEvents.slice(0, 4).join(', ')}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
