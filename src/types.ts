export type Role = 'Owner' | 'Admin' | 'Analyst' | 'Marketer' | 'Viewer'

export type Plan = 'Free' | 'Standard' | 'Premium' | 'Enterprise' | 'Powerhouse'

export type Motion = 'Lark' | '独立'

export type TimeRange = '7D' | '30D' | '90D'

export type Tenant = {
  id: string
  name: string
  region: string
  currency: string
  seats: number
  activeSeats: number
  workspaces: Workspace[]
}

export type Workspace = {
  id: string
  name: string
  plan: Plan
  motion: Motion
  seatLimit: number
  seats: number
  activeSeats: number
  trialDaysLeft?: number
  createdAt: string
}

export type MetricPoint = {
  date: string
  value: number
}

export type MetricSeries = {
  label: string
  values: MetricPoint[]
  unit?: string
}

export type FunnelStep = {
  label: string
  value: number
}

export type ChannelMetric = {
  channel: string
  visits: number
  signups: number
  cvr: number
  cac: number
}

export type RegionMetric = {
  region: string
  signups: number
  activationRate: number
}

export type ActivationPath = {
  name: string
  completed: number
  ttaMins: number
  steps: FunnelStep[]
}

export type RetentionCohort = {
  cohort: string
  d1: number
  d7: number
  d30: number
}

export type MonetizationMetrics = {
  trialToPaid: number
  mrr: number
  arr: number
  paidSeats: number
  seatUtilization: number
  upgradeFunnel: FunnelStep[]
}

export type AlertItem = {
  id: string
  title: string
  severity: '高' | '中' | '低'
  status: '触发中' | '已恢复'
  rule: string
  currentValue: string
  baseline: string
  scope: string
  time: string
}

export type EventDefinition = {
  name: string
  category: string
  description: string
  owner: string
  version: string
  requiredProps: string[]
  optionalProps: string[]
}
