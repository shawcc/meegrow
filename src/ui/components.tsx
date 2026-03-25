import type { ReactNode } from 'react'
import type { MetricSeries } from '../types'

export function Card(props: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="card">
      <div className="cardHeader">
        <div className="h">{props.title}</div>
        {props.subtitle ? <div className="sub">{props.subtitle}</div> : null}
      </div>
      {props.children}
    </section>
  )
}

export function LabeledSelect<T extends string>(props: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="select">
      <label>{props.label}</label>
      <select value={props.value} onChange={(e) => props.onChange(e.target.value as T)}>
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Pill(props: { tone: 'good' | 'warn' | 'bad'; children: ReactNode }) {
  return <span className={`pill ${props.tone}`}>{props.children}</span>
}

export function formatPct(v: number) {
  if (!Number.isFinite(v)) return '-'
  return `${(v * 100).toFixed(1)}%`
}

export function formatInt(v: number) {
  if (!Number.isFinite(v)) return '-'
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(v)
}

export function formatMoney(v: number, currency: string) {
  if (!Number.isFinite(v)) return '-'
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(v)
}

export function Spark(props: { series: MetricSeries }) {
  const values = props.series.values.map((p) => p.value)
  const max = Math.max(1, ...values)
  return (
    <div className="spark" aria-label={props.series.label}>
      {values.slice(-24).map((v, idx) => (
        <span key={`${props.series.label}-${idx}`} style={{ height: `${Math.round((v / max) * 100)}%` }} />
      ))}
    </div>
  )
}
