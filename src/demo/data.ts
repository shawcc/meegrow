import type {
  ActivationPath,
  AlertItem,
  ChannelMetric,
  EventDefinition,
  MetricSeries,
  MonetizationMetrics,
  Motion,
  RegionMetric,
  RetentionCohort,
  Tenant,
  TimeRange,
} from '../types'

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function formatDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function dateRangeDays(range: TimeRange) {
  if (range === '7D') return 7
  if (range === '30D') return 30
  return 90
}

function buildSeries(label: string, days: number, base: number, variance: number, unit?: string): MetricSeries {
  const now = new Date()
  const values = Array.from({ length: days }).map((_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (days - 1 - i))
    const noise = Math.round((Math.sin(i / 3) + Math.random() - 0.5) * variance)
    const value = Math.max(0, base + noise)
    return { date: formatDate(d), value }
  })
  return { label, values, unit }
}

export type DemoContext = {
  tenantId: string
  workspaceId: string
  motion: Motion | '全部'
  timeRange: TimeRange
}

export function getDemoTenants(): Tenant[] {
  return [
    {
      id: 't_acme',
      name: 'Acme Robotics',
      region: 'US',
      currency: 'USD',
      seats: 120,
      activeSeats: 87,
      workspaces: [
        {
          id: 'w_acme_rnd',
          name: 'R&D Delivery',
          plan: 'Enterprise',
          motion: '独立',
          seatLimit: 500,
          seats: 80,
          activeSeats: 63,
          createdAt: '2025-11-03',
        },
        {
          id: 'w_acme_ops',
          name: 'Operations',
          plan: 'Premium',
          motion: 'Lark',
          seatLimit: 200,
          seats: 40,
          activeSeats: 24,
          trialDaysLeft: 12,
          createdAt: '2026-02-18',
        },
      ],
    },
    {
      id: 't_globex',
      name: 'Globex Media',
      region: 'SG',
      currency: 'USD',
      seats: 36,
      activeSeats: 21,
      workspaces: [
        {
          id: 'w_globex_prod',
          name: 'Product & Eng',
          plan: 'Standard',
          motion: '独立',
          seatLimit: 100,
          seats: 36,
          activeSeats: 21,
          trialDaysLeft: 6,
          createdAt: '2026-03-01',
        },
      ],
    },
    {
      id: 't_lark_co',
      name: 'Lark-first Co.',
      region: 'UK',
      currency: 'GBP',
      seats: 20,
      activeSeats: 15,
      workspaces: [
        {
          id: 'w_lark_co_team',
          name: 'Team Space',
          plan: 'Free',
          motion: 'Lark',
          seatLimit: 20,
          seats: 20,
          activeSeats: 15,
          createdAt: '2026-02-10',
        },
      ],
    },
  ]
}

export function getOverviewSeries(ctx: DemoContext) {
  const days = dateRangeDays(ctx.timeRange)
  const motionBoost = ctx.motion === 'Lark' ? 1.05 : ctx.motion === '独立' ? 0.95 : 1
  const wac = buildSeries('WAC-T（每周活跃协作工作区）', days, Math.round(86 * motionBoost), 10, 'workspaces')
  const was = buildSeries('WAS（每周活跃席位）', days, Math.round(860 * motionBoost), 90, 'seats')
  const activation = buildSeries('Activated Users', days, Math.round(420 * motionBoost), 60, 'users')
  return { wac, was, activation }
}

export function getAcquisitionMetrics(ctx: DemoContext) {
  const channelBase: ChannelMetric[] = [
    { channel: 'Google Search', visits: 18200, signups: 910, cvr: 0, cac: 42 },
    { channel: 'G2', visits: 4200, signups: 310, cvr: 0, cac: 55 },
    { channel: 'LinkedIn Ads', visits: 7800, signups: 260, cvr: 0, cac: 110 },
    { channel: 'Organic Direct', visits: 5600, signups: 380, cvr: 0, cac: 18 },
  ]
  const factor = ctx.motion === 'Lark' ? 0.75 : ctx.motion === '独立' ? 1.15 : 1
  const channels = channelBase.map((c) => {
    const visits = Math.round(c.visits * factor)
    const signups = Math.round(c.signups * factor * (ctx.motion === 'Lark' ? 0.85 : 1))
    const cvr = visits === 0 ? 0 : signups / visits
    const cac = ctx.motion === 'Lark' ? Math.max(8, Math.round(c.cac * 0.6)) : c.cac
    return { ...c, visits, signups, cvr, cac }
  })
  const regions: RegionMetric[] = [
    { region: 'US', signups: Math.round(520 * factor), activationRate: ctx.motion === 'Lark' ? 0.24 : 0.28 },
    { region: 'UK', signups: Math.round(260 * factor), activationRate: ctx.motion === 'Lark' ? 0.22 : 0.26 },
    { region: 'SG', signups: Math.round(180 * factor), activationRate: ctx.motion === 'Lark' ? 0.26 : 0.3 },
    { region: 'DE', signups: Math.round(130 * factor), activationRate: ctx.motion === 'Lark' ? 0.2 : 0.24 },
  ]
  const funnel = [
    { label: 'Visit', value: channels.reduce((s, c) => s + c.visits, 0) },
    { label: 'Signup Start', value: Math.round(channels.reduce((s, c) => s + c.signups, 0) * 1.25) },
    { label: 'Signup Success', value: channels.reduce((s, c) => s + c.signups, 0) },
  ]
  return { channels, regions, funnel }
}

export function getActivationMetrics(ctx: DemoContext) {
  const factor = ctx.motion === 'Lark' ? 0.95 : ctx.motion === '独立' ? 1.05 : 1
  const paths: ActivationPath[] = [
    {
      name: '原生搭建路径',
      completed: Math.round(420 * factor),
      ttaMins: ctx.motion === 'Lark' ? 41 : 33,
      steps: [
        { label: 'Signup Success', value: Math.round(1850 * factor) },
        { label: '创建 Workspace', value: Math.round(1420 * factor) },
        { label: '创建项目/看板', value: Math.round(980 * factor) },
        { label: '创建/拆分任务 ≥5', value: Math.round(640 * factor) },
        { label: '发生协作事件（多人）', value: Math.round(420 * factor) },
      ],
    },
    {
      name: '迁移导入路径',
      completed: Math.round(360 * factor),
      ttaMins: ctx.motion === 'Lark' ? 52 : 39,
      steps: [
        { label: 'Signup Success', value: Math.round(1850 * factor) },
        { label: '开始导入', value: Math.round(720 * factor) },
        { label: '导入成功', value: Math.round(650 * factor) },
        { label: '成员/字段映射成功', value: Math.round(510 * factor) },
        { label: '发生协作事件（多人）', value: Math.round(360 * factor) },
      ],
    },
  ]
  const onboardingDrop = [
    { label: 'Workspace 创建', value: ctx.motion === 'Lark' ? 0.76 : 0.79 },
    { label: '导入/新建任务', value: ctx.motion === 'Lark' ? 0.61 : 0.66 },
    { label: '邀请同事', value: ctx.motion === 'Lark' ? 0.28 : 0.34 },
  ]
  return { paths, onboardingDrop }
}

export function getRetentionMetrics(ctx: DemoContext) {
  const factor = ctx.motion === 'Lark' ? 1.02 : ctx.motion === '独立' ? 0.98 : 1
  const cohorts: RetentionCohort[] = [
    { cohort: '2026-W08', d1: 0.62 * factor, d7: 0.41 * factor, d30: 0.28 * factor },
    { cohort: '2026-W09', d1: 0.6 * factor, d7: 0.39 * factor, d30: 0.27 * factor },
    { cohort: '2026-W10', d1: 0.63 * factor, d7: 0.42 * factor, d30: 0.29 * factor },
    { cohort: '2026-W11', d1: 0.61 * factor, d7: 0.4 * factor, d30: 0.28 * factor },
  ].map((c) => ({
    cohort: c.cohort,
    d1: Math.min(0.9, c.d1),
    d7: Math.min(0.8, c.d7),
    d30: Math.min(0.7, c.d30),
  }))
  const stickiness = buildSeries('协作深度（每活跃 workspace 协作事件数）', dateRangeDays(ctx.timeRange), 86, 14, 'events')
  return { cohorts, stickiness }
}

export function getMonetizationMetrics(ctx: DemoContext): MonetizationMetrics {
  const factor = ctx.motion === 'Lark' ? 0.85 : ctx.motion === '独立' ? 1.1 : 1
  const paidSeats = Math.round(680 * factor)
  const seatUtilization = ctx.motion === 'Lark' ? 0.71 : 0.76
  const mrr = Math.round(68000 * factor)
  const arr = mrr * 12
  const trialToPaid = ctx.motion === 'Lark' ? 0.13 : 0.18
  const upgradeFunnel = [
    { label: 'Paywall View', value: Math.round(4100 * factor) },
    { label: 'Upgrade Click', value: Math.round(1320 * factor) },
    { label: 'Checkout Start', value: Math.round(620 * factor) },
    { label: 'Paid', value: Math.round(320 * factor) },
  ]
  return { trialToPaid, mrr, arr, paidSeats, seatUtilization, upgradeFunnel }
}

export function getAlerts(ctx: DemoContext): AlertItem[] {
  const now = new Date()
  const t = `${formatDate(now)} ${pad2(now.getHours())}:${pad2(now.getMinutes())}`
  const scope = ctx.motion === '全部' ? '全量' : `motion=${ctx.motion}`
  return [
    {
      id: 'a1',
      title: '激活率下降（环比异常）',
      severity: '高',
      status: '触发中',
      rule: 'Activation Rate 较前 7 日均值下降 > 15%',
      currentValue: '18.2%',
      baseline: '22.6%',
      scope: `${scope}，country=US，plan=Standard/Premium`,
      time: t,
    },
    {
      id: 'a2',
      title: '导入成功率低于阈值',
      severity: '中',
      status: '触发中',
      rule: 'Import Success < 90% 持续 6 小时',
      currentValue: '87.4%',
      baseline: '阈值=90%',
      scope: `${scope}，source=Trello`,
      time: t,
    },
    {
      id: 'a3',
      title: '邀请接受率回升',
      severity: '低',
      status: '已恢复',
      rule: 'Invite Accept < 25% 持续 24 小时',
      currentValue: '29.8%',
      baseline: '阈值=25%',
      scope: `${scope}`,
      time: t,
    },
  ]
}

export function getEventDictionary(): EventDefinition[] {
  const baseProps = [
    'tenant_id',
    'workspace_id',
    'user_id',
    'anonymous_id',
    'session_id',
    'platform',
    'app_version',
    'locale',
    'country',
    'timezone',
  ]
  const acquisitionProps = ['utm_source', 'utm_medium', 'utm_campaign', 'referrer']
  return [
    {
      name: 'auth_signup_success',
      category: 'Acquisition',
      description: '注册成功',
      owner: 'Growth',
      version: '1.0.0',
      requiredProps: [...baseProps, ...acquisitionProps],
      optionalProps: ['motion', 'signup_method'],
    },
    {
      name: 'ws_create_success',
      category: 'Activation',
      description: '创建 workspace 成功',
      owner: 'Product',
      version: '1.0.0',
      requiredProps: [...baseProps],
      optionalProps: ['plan', 'trial_days_left'],
    },
    {
      name: 'import_success',
      category: 'Activation',
      description: '从 Jira/Trello 导入成功',
      owner: 'Product',
      version: '1.0.0',
      requiredProps: [...baseProps, 'source'],
      optionalProps: ['duration_ms', 'mapped_users', 'mapped_fields'],
    },
    {
      name: 'invite_send',
      category: 'Collaboration',
      description: '发送邀请',
      owner: 'Growth',
      version: '1.0.0',
      requiredProps: [...baseProps, 'invitee_domain'],
      optionalProps: ['invite_count'],
    },
    {
      name: 'issue_status_transition',
      category: 'Collaboration',
      description: '任务状态流转',
      owner: 'Product',
      version: '1.0.0',
      requiredProps: [...baseProps, 'issue_id', 'from_status', 'to_status'],
      optionalProps: ['project_id'],
    },
    {
      name: 'paywall_view',
      category: 'Monetization',
      description: '看到付费墙',
      owner: 'Growth',
      version: '1.0.0',
      requiredProps: [...baseProps, 'feature_gate'],
      optionalProps: ['current_plan', 'target_plan'],
    },
    {
      name: 'subscription_created',
      category: 'Monetization',
      description: '订阅创建/支付成功',
      owner: 'Billing',
      version: '1.0.0',
      requiredProps: [...baseProps, 'plan', 'amount', 'currency'],
      optionalProps: ['billing_period', 'seats_purchased'],
    },
  ]
}
