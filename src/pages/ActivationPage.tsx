import { getActivationMetrics } from '../demo/data'
import { useDemoState } from '../demo/state'
import { Card, Pill, formatInt, formatPct } from '../ui/components'

export function ActivationPage() {
  const { tenant, workspaceId, motion, timeRange } = useDemoState()
  const ctx = { tenantId: tenant.id, workspaceId, motion, timeRange }
  const { paths, onboardingDrop } = getActivationMetrics(ctx)

  return (
    <div className="grid">
      <div style={{ gridColumn: 'span 12' }}>
        <Card title="Aha/激活路径" subtitle="原生搭建 vs 迁移导入（示例口径）">
          <div className="twoCol">
            {paths.map((p) => {
              const total = p.steps[0]?.value ?? 0
              const completed = p.steps[p.steps.length - 1]?.value ?? 0
              const rate = total === 0 ? 0 : completed / total
              return (
                <div key={p.name} className="card" style={{ boxShadow: 'none' }}>
                  <div className="cardHeader">
                    <div className="h">{p.name}</div>
                    <div className="sub">TTA={formatInt(p.ttaMins)} min</div>
                  </div>
                  <div className="kpi">
                    {formatInt(p.completed)} <span style={{ fontSize: 14, color: 'var(--muted)' }}>completed</span>
                  </div>
                  <div className="kpiMeta">
                    激活率 {formatPct(rate)} · 定义：到达最后一步（多人协作有效事件）
                  </div>
                  <table className="table" style={{ marginTop: 8 }}>
                    <thead>
                      <tr>
                        <th>步骤</th>
                        <th>数量</th>
                        <th>转化</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.steps.map((s, idx) => {
                        const prev = idx === 0 ? s.value : p.steps[idx - 1]!.value
                        const r = prev === 0 ? 0 : s.value / prev
                        return (
                          <tr key={`${p.name}-${s.label}`}>
                            <td>{s.label}</td>
                            <td>{formatInt(s.value)}</td>
                            <td>{idx === 0 ? '-' : formatPct(r)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 12' }}>
        <Card title="新手引导掉点" subtitle="用于定位 onboarding 问题（示例）">
          <table className="table">
            <thead>
              <tr>
                <th>环节</th>
                <th>完成率</th>
                <th>预警</th>
              </tr>
            </thead>
            <tbody>
              {onboardingDrop.map((x) => {
                const tone = x.value < 0.3 ? 'bad' : x.value < 0.6 ? 'warn' : 'good'
                return (
                  <tr key={x.label}>
                    <td>{x.label}</td>
                    <td>{formatPct(x.value)}</td>
                    <td>
                      <Pill tone={tone}>{tone === 'bad' ? '高风险' : tone === 'warn' ? '关注' : '正常'}</Pill>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
