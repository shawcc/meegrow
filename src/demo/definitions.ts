export type MetricDefinition = {
  key: string
  name: string
  description: string
  formula: string
  sourceEvents: string[]
  dimensions: string[]
  grain: 'daily' | 'weekly' | 'monthly'
}

export const MetricDefinitions: MetricDefinition[] = [
  {
    key: 'wac_t',
    name: 'WAC-T',
    description: '每周活跃协作工作区数',
    formula:
      '统计周期内，workspace 维度：7天内同一 workspace ≥3 位成员发生有效协作事件的 workspace 数量',
    sourceEvents: ['issue_create_success', 'issue_status_transition', 'issue_comment_create', 'issue_assign', 'mention_user'],
    dimensions: ['tenant_id', 'workspace_id', 'motion', 'country', 'plan', 'platform'],
    grain: 'weekly',
  },
  {
    key: 'was',
    name: 'WAS',
    description: '每周活跃席位数（可拆 Paid/Trial/Free）',
    formula: '统计周期内，有至少一次有效行为的唯一 user_id（按 seat 口径）',
    sourceEvents: ['auth_signup_success', 'ws_join_success', 'issue_status_transition', 'issue_comment_create'],
    dimensions: ['tenant_id', 'workspace_id', 'motion', 'country', 'plan', 'platform'],
    grain: 'weekly',
  },
  {
    key: 'activation_rate',
    name: 'Activation Rate',
    description: '激活率（Aha）',
    formula: 'Activated Teams / Signup Success（或 Activated Users / Signup Success，按口径配置）',
    sourceEvents: ['ws_create_success', 'import_success', 'invite_send', 'issue_status_transition'],
    dimensions: ['tenant_id', 'workspace_id', 'motion', 'country', 'channel', 'plan'],
    grain: 'daily',
  },
  {
    key: 'trial_to_paid',
    name: 'Trial→Paid',
    description: '试用转付费（S/P 30天）',
    formula: '试用期内产生 subscription_created 的 workspace / 开通试用的 workspace',
    sourceEvents: ['checkout_start', 'subscription_created'],
    dimensions: ['tenant_id', 'workspace_id', 'motion', 'country', 'plan', 'channel'],
    grain: 'weekly',
  },
]
