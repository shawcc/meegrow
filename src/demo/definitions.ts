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
  {
    key: 'invite_accept_rate',
    name: 'Invite Accept Rate',
    description: '邀请接受率（过程指标）',
    formula: 'invite_accept / invite_send（按 workspace/国家/域名切片）',
    sourceEvents: ['invite_send', 'invite_accept'],
    dimensions: ['tenant_id', 'workspace_id', 'motion', 'country', 'invitee_domain', 'plan'],
    grain: 'daily',
  },
  {
    key: 'multi_collab_rate',
    name: 'Multi-collab Rate',
    description: '多人协作达成率（过程指标）',
    formula: '达到“同一 workspace ≥3 人发生有效协作事件”的 workspace / 活跃 workspace',
    sourceEvents: ['issue_status_transition', 'issue_comment_create', 'issue_assign', 'mention_user'],
    dimensions: ['tenant_id', 'workspace_id', 'motion', 'country', 'plan'],
    grain: 'weekly',
  },
  {
    key: 'seat_utilization',
    name: 'Seat Utilization',
    description: '席位利用率（领先指标）',
    formula: '活跃席位 / 已购席位（按 tenant 汇总，workspace 分布）',
    sourceEvents: ['ws_join_success', 'issue_status_transition', 'issue_comment_create'],
    dimensions: ['tenant_id', 'workspace_id', 'plan', 'motion'],
    grain: 'weekly',
  },
]
