import { getRetentionMetrics } from '../demo/data'
import { useDemoState } from '../demo/state'
import { Card, Spark, formatPct } from '../ui/components'

export function RetentionPage() {
  const { tenant, workspaceId, motion, timeRange } = useDemoState()
  const ctx = { tenantId: tenant.id, workspaceId, motion, timeRange }
  const { cohorts, stickiness } = getRetentionMetrics(ctx)

  return (
    <div className="grid">
      <div style={{ gridColumn: 'span 7' }}>
        <Card title="分群留存（workspace cohort）" subtitle="D1 / D7 / D30（示例，基于激活）">
          <table className="table">
            <thead>
              <tr>
                <th>Cohort</th>
                <th>D1</th>
                <th>D7</th>
                <th>D30</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c) => (
                <tr key={c.cohort}>
                  <td>{c.cohort}</td>
                  <td>{formatPct(c.d1)}</td>
                  <td>{formatPct(c.d7)}</td>
                  <td>{formatPct(c.d30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 5' }}>
        <Card title="粘性/协作深度" subtitle="每活跃 workspace 的协作事件数（示例）">
          <div className="kpi" style={{ marginTop: 4 }}>
            {stickiness.values[stickiness.values.length - 1]?.value ?? 0}
          </div>
          <div className="kpiMeta">建议与 WAC-T 同时看：规模 vs 深度</div>
          <Spark series={stickiness} />
        </Card>
      </div>
    </div>
  )
}
