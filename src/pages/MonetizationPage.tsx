import { getMonetizationMetrics } from '../demo/data'
import { useDemoState } from '../demo/state'
import { Card, formatInt, formatMoney, formatPct } from '../ui/components'

export function MonetizationPage() {
  const { tenant, workspaceId, motion, timeRange, currency } = useDemoState()
  const ctx = { tenantId: tenant.id, workspaceId, motion, timeRange }
  const m = getMonetizationMetrics(ctx)

  return (
    <div className="grid">
      <div style={{ gridColumn: 'span 12' }}>
        <Card title="核心商业化指标" subtitle="按席位计费：扩席领先指标 + 试用转付费">
          <div className="grid">
            <div style={{ gridColumn: 'span 3' }} className="card">
              <div className="cardHeader">
                <div className="h">Trial → Paid</div>
                <div className="sub">S/P 30 天试用</div>
              </div>
              <div className="kpi">{formatPct(m.trialToPaid)}</div>
            </div>
            <div style={{ gridColumn: 'span 3' }} className="card">
              <div className="cardHeader">
                <div className="h">Paid Seats</div>
                <div className="sub">付费席位</div>
              </div>
              <div className="kpi">{formatInt(m.paidSeats)}</div>
            </div>
            <div style={{ gridColumn: 'span 3' }} className="card">
              <div className="cardHeader">
                <div className="h">Seat Utilization</div>
                <div className="sub">活跃/已购</div>
              </div>
              <div className="kpi">{formatPct(m.seatUtilization)}</div>
            </div>
            <div style={{ gridColumn: 'span 3' }} className="card">
              <div className="cardHeader">
                <div className="h">MRR</div>
                <div className="sub">月经常性收入</div>
              </div>
              <div className="kpi">{formatMoney(m.mrr, currency)}</div>
              <div className="kpiMeta">ARR ≈ {formatMoney(m.arr, currency)}</div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 12' }}>
        <Card title="升级漏斗" subtitle="Paywall → Upgrade Click → Checkout → Paid（示例）">
          <table className="table">
            <thead>
              <tr>
                <th>步骤</th>
                <th>数量</th>
                <th>转化率</th>
              </tr>
            </thead>
            <tbody>
              {m.upgradeFunnel.map((s, idx) => {
                const prev = idx === 0 ? s.value : m.upgradeFunnel[idx - 1]!.value
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
    </div>
  )
}
