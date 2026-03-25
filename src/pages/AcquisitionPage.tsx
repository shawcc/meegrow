import { getAcquisitionMetrics } from '../demo/data'
import { useDemoState } from '../demo/state'
import { Card, formatInt, formatMoney, formatPct } from '../ui/components'

export function AcquisitionPage() {
  const { tenant, workspaceId, motion, timeRange, currency } = useDemoState()
  const ctx = { tenantId: tenant.id, workspaceId, motion, timeRange }
  const { channels, regions, funnel } = getAcquisitionMetrics(ctx)

  return (
    <div className="grid">
      <div style={{ gridColumn: 'span 12' }}>
        <Card title="渠道漏斗" subtitle="Visit → Signup Start → Signup Success">
          <table className="table">
            <thead>
              <tr>
                <th>步骤</th>
                <th>人数/次数</th>
                <th>转化率</th>
              </tr>
            </thead>
            <tbody>
              {funnel.map((s, idx) => {
                const prev = idx === 0 ? s.value : funnel[idx - 1]!.value
                const rate = prev === 0 ? 0 : s.value / prev
                return (
                  <tr key={s.label}>
                    <td>{s.label}</td>
                    <td>{formatInt(s.value)}</td>
                    <td>{idx === 0 ? '-' : formatPct(rate)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 7' }}>
        <Card title="渠道 ROI（示例）" subtitle="以注册为目标的简化对比">
          <table className="table">
            <thead>
              <tr>
                <th>渠道</th>
                <th>Visit</th>
                <th>Signups</th>
                <th>CVR</th>
                <th>CAC</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c) => (
                <tr key={c.channel}>
                  <td>{c.channel}</td>
                  <td>{formatInt(c.visits)}</td>
                  <td>{formatInt(c.signups)}</td>
                  <td>{formatPct(c.cvr)}</td>
                  <td>{formatMoney(c.cac, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 5' }}>
        <Card title="地区质量" subtitle="注册量与激活率（示例）">
          <table className="table">
            <thead>
              <tr>
                <th>地区</th>
                <th>Signups</th>
                <th>Activation</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((r) => (
                <tr key={r.region}>
                  <td>{r.region}</td>
                  <td>{formatInt(r.signups)}</td>
                  <td>{formatPct(r.activationRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
