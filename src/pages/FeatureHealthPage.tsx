import { getFeatureHealthMetrics } from '../demo/data'
import { useDemoState } from '../demo/state'
import { Card, Pill, formatInt, formatPct } from '../ui/components'

function trendPill(trend: 'up' | 'down' | 'flat') {
  if (trend === 'up') return <Pill tone="good">上升</Pill>
  if (trend === 'down') return <Pill tone="bad">下降</Pill>
  return <Pill tone="warn">持平</Pill>
}

export function FeatureHealthPage() {
  const { tenant, workspaceId, motion, timeRange } = useDemoState()
  const ctx = { tenantId: tenant.id, workspaceId, motion, timeRange }
  const { metrics, funnels, latency } = getFeatureHealthMetrics(ctx)

  return (
    <div className="grid">
      <div style={{ gridColumn: 'span 12' }}>
        <Card title="功能健康度" subtitle="过程指标：邀请与协作链路（导入非主场景）">
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            用途：当结果指标（WAC/激活/留存）波动时，快速定位是「邀请」「多人协作」「任务流转」「性能稳定性」哪一块异常。
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 12' }}>
        <Card title="关键过程指标" subtitle="带目标值与趋势（示例）">
          <table className="table">
            <thead>
              <tr>
                <th>指标</th>
                <th>当前</th>
                <th>目标</th>
                <th>趋势</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => {
                const isPct = m.unit === '%'
                const current = isPct ? formatPct(m.value) : `${formatInt(m.value)} ${m.unit}`
                const target =
                  m.target == null ? '-' : isPct ? formatPct(m.target) : `${formatInt(m.target)} ${m.unit}`
                return (
                  <tr key={m.name}>
                    <td>{m.name}</td>
                    <td>{current}</td>
                    <td style={{ color: 'var(--muted)' }}>{target}</td>
                    <td>{trendPill(m.trend)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 12' }}>
        <Card title="功能漏斗" subtitle="过程链路可切片（示例）">
          <div className="twoCol">
            {funnels.map((f) => (
              <div key={f.name} className="card" style={{ boxShadow: 'none' }}>
                <div className="cardHeader">
                  <div className="h">{f.name}</div>
                  <div className="sub">motion={motion}</div>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>步骤</th>
                      <th>数量</th>
                      <th>转化</th>
                    </tr>
                  </thead>
                  <tbody>
                    {f.steps.map((s, idx) => {
                      const prev = idx === 0 ? s.value : f.steps[idx - 1]!.value
                      const rate = prev === 0 ? 0 : s.value / prev
                      return (
                        <tr key={`${f.name}-${s.label}`}>
                          <td>{s.label}</td>
                          <td>{formatInt(s.value)}</td>
                          <td>{idx === 0 ? '-' : formatPct(rate)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 12' }}>
        <Card title="性能与稳定性" subtitle="P50/P95 延迟与错误率（示例）">
          <table className="table">
            <thead>
              <tr>
                <th>链路</th>
                <th>P50</th>
                <th>P95</th>
                <th>Error Rate</th>
              </tr>
            </thead>
            <tbody>
              {latency.map((x) => (
                <tr key={x.name}>
                  <td>{x.name}</td>
                  <td>{formatInt(x.p50)} ms</td>
                  <td>{formatInt(x.p95)} ms</td>
                  <td>{formatPct(x.errorRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
