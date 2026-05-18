'use client'

import { useEffect, useState } from 'react'
import { BASE_PATH } from '@/lib/basePath'

type Stats = {
  total: number
  selected: number
  checkedIn: number
  plusOneCheckedIn: number
  totalPresent: number
  recentScans: Array<{
    id: string
    name: string
    seatLabel: string | null
    checkedInAt: string
    plusOneName: string | null
    plusOneCheckedIn: boolean
  }>
}

type Event = {
  id: string
  name: string
  date: string
  time: string
  city: string
  venue: string
  maxCapacity: number
}

const STAT_CARDS = [
  {
    key: 'total' as const,
    label: 'All Attendees',
    dotColor: '#f2ba30',
    valueColor: '#f2ba30',
    border: '#795d18',
    gradient: 'linear-gradient(to right, #1a1405, #0f0d03)',
    sub: (stats: Stats) => `+${Math.max(0, stats.total - stats.selected)} not selected`,
  },
  {
    key: 'selected' as const,
    label: 'Selected',
    dotColor: '#6666e5',
    valueColor: '#6666e5',
    border: '#333373',
    gradient: 'linear-gradient(to right, #0a0a1a, #05050f)',
    sub: (stats: Stats, ev?: Event | null) =>
      ev ? `${stats.selected}/${ev.maxCapacity} capacity used` : '',
  },
  {
    key: 'notSelected' as const,
    label: 'Waitlisted',
    dotColor: '#ef4444',
    valueColor: '#ef4444',
    border: '#722222',
    gradient: 'linear-gradient(to right, #1a0a05, #120503)',
    sub: () => 'Not yet confirmed',
  },
  {
    key: 'checkedIn' as const,
    label: 'Checked-in',
    dotColor: '#1ed25a',
    valueColor: '#1ed25a',
    border: '#0f692d',
    gradient: 'linear-gradient(to right, #051a0a, #030f05)',
    sub: (stats: Stats, ev?: Event | null) =>
      ev ? `${stats.checkedIn}/${ev.maxCapacity * 2} passes used` : '',
  },
]

export default function DashboardPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const evRes = await fetch(BASE_PATH + '/api/admin/event')
        if (!evRes.ok) { setLoading(false); return }
        const { event } = await evRes.json()
        if (!event) { setLoading(false); return }
        setEvent(event)
        const stRes = await fetch(BASE_PATH + `/api/admin/checkin/stats?eventId=${event.id}`)
        if (stRes.ok) setStats(await stRes.json())
      } finally {
        setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [])

  const statValues: Record<string, number> = stats
    ? {
        total:       stats.total,
        selected:    stats.selected,
        notSelected: Math.max(0, stats.total - stats.selected - stats.checkedIn),
        checkedIn:   stats.checkedIn,
      }
    : { total: 0, selected: 0, notSelected: 0, checkedIn: 0 }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Page header */}
      <div className="flex items-center h-16 px-8 border-b" style={{ borderColor: '#252525' }}>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="p-8 max-w-5xl">
        {loading ? (
          <Spinner />
        ) : !event ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(242,186,48,0.1)', border: '1px solid rgba(242,186,48,0.2)' }}>
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No event yet</h2>
            <p className="text-sm mb-6 max-w-xs" style={{ color: 'rgba(102,102,102,0.8)' }}>
              Create your event in Settings to start managing attendees and check-ins.
            </p>
            <a href={BASE_PATH + '/admin/meetup-settings'}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-black"
              style={{ background: 'var(--accent)' }}>
              Create Event →
            </a>
          </div>
        ) : !stats ? (
          <p className="text-sm" style={{ color: 'rgba(102,102,102,0.7)' }}>
            No attendees yet. Import a CSV from the Attendees page.
          </p>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {STAT_CARDS.map(card => (
                <div
                  key={card.key}
                  className="rounded-xl overflow-hidden px-4 py-4"
                  style={{
                    background: card.gradient,
                    border: `0.8px solid ${card.border}`,
                  }}
                >
                  {/* Dot */}
                  <div className="w-1.5 h-1.5 rounded-full mb-2" style={{ background: card.dotColor }} />
                  <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {card.label}
                  </p>
                  <p className="text-3xl font-extrabold leading-none mb-1.5" style={{ color: card.valueColor }}>
                    {statValues[card.key].toLocaleString()}
                  </p>
                  <p className="text-[11px]" style={{ color: '#404040' }}>
                    {card.sub(stats, event)}
                  </p>
                </div>
              ))}
            </div>

            {/* Gold gradient divider */}
            <div
              className="h-0.5 rounded-full mb-5"
              style={{
                background: 'linear-gradient(90deg, rgba(242,186,48,0) 0%, rgba(242,186,48,0.8) 30%, rgba(242,186,48,0.8) 70%, rgba(242,186,48,0) 100%)',
              }}
            />

            {/* Recent Activity */}
            <p className="text-base font-semibold text-white mb-4">Recent Activity</p>

            {stats.recentScans.length === 0 ? (
              <p className="text-sm" style={{ color: 'rgba(102,102,102,0.7)' }}>No check-ins yet.</p>
            ) : (
              <div className="space-y-2">
                {stats.recentScans.map(s => (
                  <div
                    key={s.id}
                    className="flex items-center rounded-lg overflow-hidden px-3"
                    style={{
                      background: 'rgba(22,22,22,0.8)',
                      border: '0.5px solid #252525',
                      height: 52,
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 mr-3"
                      style={{ background: '#26262e' }}
                    >
                      <span className="text-[13px] font-bold" style={{ color: '#f2ba30' }}>
                        {s.name[0].toUpperCase()}
                      </span>
                    </div>

                    {/* Name + action */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{s.name}</p>
                      <p className="text-[13px]" style={{ color: '#666' }}>
                        Checked in via QR
                        {s.plusOneName && ` · +1: ${s.plusOneName}${s.plusOneCheckedIn ? ' ✓' : ''}`}
                      </p>
                    </div>

                    {/* Seat badge */}
                    {s.seatLabel && (
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded mr-3 flex-shrink-0"
                        style={{ background: 'rgba(242,186,48,0.12)', color: '#f2ba30' }}
                      >
                        {s.seatLabel}
                      </span>
                    )}

                    {/* Status badge */}
                    <div
                      className="flex-shrink-0 rounded-full px-3 py-0.5 mr-3"
                      style={{ background: 'rgba(30,210,90,0.15)' }}
                    >
                      <span className="text-[10px] font-semibold" style={{ color: '#1ed25a' }}>
                        checked-in
                      </span>
                    </div>

                    {/* Time */}
                    <span className="text-xs flex-shrink-0" style={{ color: 'rgba(102,102,102,0.5)' }}>
                      {formatRelative(s.checkedInAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function formatRelative(isoStr: string): string {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div
        className="w-6 h-6 rounded-full border-2 animate-spin"
        style={{ borderColor: '#f2ba30', borderTopColor: 'transparent' }}
      />
    </div>
  )
}
