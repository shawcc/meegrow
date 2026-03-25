import { getEventDictionary } from '../demo/data'
import { useDemoState } from '../demo/state'
import { hasPerm } from '../auth'
import { Card, Pill } from '../ui/components'

export function EventDictionaryPage() {
  const { role } = useDemoState()
  const events = getEventDictionary()
  const canManage = hasPerm(role, 'manage_event_dictionary')

  return (
    <div className="grid">
      <div style={{ gridColumn: 'span 12' }}>
        <Card title="事件字典" subtitle="命名规范 + schema（示例）">
          <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 10 }}>
            事件统一：domain_action_object；属性统一 snake_case；必填字段用于 tenant/workspace 隔离与跨端一致分析。
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            <Pill tone={canManage ? 'good' : 'warn'}>
              当前角色 {role} · {canManage ? '可管理事件字典' : '只读'}
            </Pill>
            <Pill tone="warn">默认禁采/脱敏 PII（email/ip 等）</Pill>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>事件名</th>
                <th>类别</th>
                <th>描述</th>
                <th>Owner</th>
                <th>版本</th>
                <th>必填属性</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.name}>
                  <td>{e.name}</td>
                  <td>{e.category}</td>
                  <td>{e.description}</td>
                  <td>{e.owner}</td>
                  <td>{e.version}</td>
                  <td style={{ color: 'var(--muted)' }}>{e.requiredProps.slice(0, 6).join(', ')}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
