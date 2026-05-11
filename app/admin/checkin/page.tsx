'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'

const QRScanner = dynamic(() => import('@/components/admin/QRScanner'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#000' }}>
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading camera…</p>
    </div>
  ),
})

type ScanResult = {
  status: string
  passType?: 'primary' | 'plusone'
  attendee?: {
    name: string
    seatLabel: string | null
    checkedInAt: string | null
    plusOneCheckedInAt: string | null
    plusOneName: string | null
  }
  message?: string
}

type RecentScan = ScanResult & { ts: number }

const RESULT_CONFIG = {
  SUCCESS:            { border: '#0f331a', from: '#0a1a0d', icon: '✓', label: 'Checked In',  color: '#1ed25a', badgeBg: 'rgba(30,210,90,0.18)' },
  ALREADY_CHECKED_IN: { border: '#5a4000', from: '#1a1200', icon: '⚠', label: 'Already In',  color: '#f2ba30', badgeBg: 'rgba(242,186,48,0.18)' },
  NOT_FOUND:          { border: '#401212', from: '#1f0a0a', icon: '✗', label: 'Not Found',   color: '#ef4444', badgeBg: 'rgba(239,68,68,0.18)'  },
  WRONG_EVENT:        { border: '#401212', from: '#1f0a0a', icon: '✗', label: 'Wrong Event', color: '#ef4444', badgeBg: 'rgba(239,68,68,0.18)'  },
  NOT_SELECTED:       { border: '#401212', from: '#1f0a0a', icon: '✗', label: 'Not on List', color: '#ef4444', badgeBg: 'rgba(239,68,68,0.18)'  },
  INVALID_QR:         { border: '#401212', from: '#1f0a0a', icon: '✗', label: 'Invalid QR',  color: '#ef4444', badgeBg: 'rgba(239,68,68,0.18)'  },
  NO_PLUS_ONE:        { border: '#401212', from: '#1f0a0a', icon: '✗', label: 'No +1',       color: '#ef4444', badgeBg: 'rgba(239,68,68,0.18)'  },
}

function getResultCfg(status: string) {
  return RESULT_CONFIG[status as keyof typeof RESULT_CONFIG] ?? RESULT_CONFIG.INVALID_QR
}

export default function CheckinPage() {
  const [result, setResult]           = useState<ScanResult | null>(null)
  const [recent, setRecent]           = useState<RecentScan[]>([])
  const [stats, setStats]             = useState<{ checkedIn: number; selected: number } | null>(null)
  const [eventId, setEventId]         = useState<string | null>(null)
  const [scannerKey, setScannerKey]   = useState(0)
  const [isLive, setIsLive]           = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch('/api/admin/event').then(r => r.ok ? r.json() : null).then(d => {
      if (!d) return
      setEventId(d.event.id)
      loadStats(d.event.id)
    })
  }, [])

  async function loadStats(id: string) {
    const res = await fetch(`/api/admin/checkin/stats?eventId=${id}`)
    if (res.ok) {
      const d = await res.json()
      setStats({ checkedIn: d.checkedIn, selected: d.selected })
    }
  }

  const handleResult = useCallback((r: ScanResult) => {
    setResult(r)
    setIsLive(false)
    setRecent(prev => [{ ...r, ts: Date.now() }, ...prev].slice(0, 30))
    if (eventId) loadStats(eventId)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setResult(null)
      setIsLive(true)
      setScannerKey(k => k + 1)
    }, 3000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0a0a0f' }}>

      {/* Page header */}
      <div className="flex items-center h-16 px-8 border-b flex-shrink-0" style={{ borderColor: '#252525' }}>
        <h1 className="text-xl font-bold text-white mr-4">Check-in Scanner</h1>

        {/* LIVE badge */}
        <div
          className="flex items-center gap-1.5 h-7 px-3 rounded-full mr-auto"
          style={{ background: 'rgba(30,210,90,0.15)', border: '0.4px solid #1ed25a' }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1ed25a' }} />
          <span className="text-[11px] font-bold" style={{ color: '#1ed25a' }}>LIVE</span>
        </div>

        {/* Stats mini */}
        {stats && (
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-lg font-extrabold leading-none" style={{ color: '#f2ba30' }}>{stats.checkedIn}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(102,102,102,0.7)' }}>Today</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold leading-none" style={{ color: '#f2ba30' }}>{stats.selected}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(102,102,102,0.7)' }}>Total</p>
            </div>
          </div>
        )}
      </div>

      {/* Body: split layout */}
      <div className="flex flex-1 min-h-0">

        {/* Left: scanner panel — camera fills full panel */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at center, #0f0d05 0%, #06060a 60%, #0a0a0f 100%)',
            borderRight: '1px solid #252525',
          }}
        >
          {/* Camera fills the entire panel */}
          <QRScanner key={scannerKey} onResult={handleResult} />

          {/* Ambient centre glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(242,186,48,0.06) 0%, transparent 70%)',
            }}
          />

          {/* Corner bracket decorations */}
          {([
            { top: 20, left: 20, rotate: 0 },
            { top: 20, right: 20, rotate: 90 },
            { bottom: 20, right: 20, rotate: 180 },
            { bottom: 20, left: 20, rotate: 270 },
          ] as { top?: number; bottom?: number; left?: number; right?: number; rotate: number }[]).map((pos, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                width: 36, height: 36,
                top: pos.top, bottom: pos.bottom,
                left: pos.left, right: pos.right,
                transform: `rotate(${pos.rotate}deg)`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-sm" style={{ background: '#f2ba30' }} />
              <div className="absolute top-0 left-0 bottom-0 w-[3px] rounded-sm" style={{ background: '#f2ba30' }} />
            </div>
          ))}

          {/* Instructions — pinned to bottom */}
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Position QR code within frame
            </p>
            <p className="text-xs" style={{ color: isLive ? 'rgba(242,186,48,0.9)' : 'rgba(102,102,102,0.5)' }}>
              {isLive ? 'Scanning…' : 'Processing…'}
            </p>
          </div>

          {/* Result overlay — covers full panel */}
          {result && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
              style={{
                background: `linear-gradient(135deg, ${getResultCfg(result.status).from} 0%, rgba(10,10,15,0.97) 100%)`,
                border: `1px solid ${getResultCfg(result.status).border}`,
              }}
            >
              <p className="text-6xl font-bold mb-3" style={{ color: getResultCfg(result.status).color }}>
                {getResultCfg(result.status).icon}
              </p>
              <p className="text-2xl font-bold mb-3" style={{ color: getResultCfg(result.status).color }}>
                {getResultCfg(result.status).label}
              </p>
              {result.attendee && (
                <div className="space-y-2">
                  <p className="text-xl text-white font-semibold">
                    {result.passType === 'plusone'
                      ? result.attendee.plusOneName ?? result.attendee.name
                      : result.attendee.name}
                  </p>
                  {result.passType === 'plusone' && (
                    <p className="text-sm" style={{ color: '#666' }}>Guest of {result.attendee.name}</p>
                  )}
                  {result.attendee.seatLabel && (
                    <span
                      className="inline-block px-4 py-1.5 rounded-lg font-mono text-sm"
                      style={{ background: 'rgba(242,186,48,0.15)', color: '#f2ba30' }}
                    >
                      Seat {result.attendee.seatLabel}
                    </span>
                  )}
                </div>
              )}
              {result.message && !result.attendee && (
                <p className="text-sm mt-2" style={{ color: '#888' }}>{result.message}</p>
              )}
              <p className="text-xs mt-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Resuming in 3s…</p>
            </div>
          )}
        </div>

        {/* Right: recent check-ins */}
        <div className="flex-shrink-0 overflow-y-auto" style={{ width: 420 }}>
          <p className="px-6 pt-6 pb-4 text-[15px] font-semibold text-white">Recent Check-ins</p>

          {recent.length === 0 ? (
            <p className="px-6 text-sm" style={{ color: 'rgba(102,102,102,0.5)' }}>No scans yet</p>
          ) : (
            <div className="px-6 space-y-2 pb-6">
              {recent.map((r, i) => {
                const cfg = getResultCfg(r.status)
                const isSuccess = r.status === 'SUCCESS' || r.status === 'ALREADY_CHECKED_IN'
                const name = r.attendee
                  ? (r.passType === 'plusone' ? r.attendee.plusOneName ?? r.attendee.name : r.attendee.name)
                  : r.message ?? r.status
                const seat = r.attendee?.seatLabel

                return (
                  <div
                    key={i}
                    className="flex items-center rounded-xl overflow-hidden px-3.5"
                    style={{
                      height: 64,
                      background: `linear-gradient(to right, ${cfg.from}, #161616)`,
                      border: `0.5px solid ${cfg.border}`,
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mr-3"
                      style={{ background: '#26262e' }}
                    >
                      <span className="text-[13px] font-bold" style={{ color: isSuccess ? '#1ed25a' : '#ef4444' }}>
                        {(name ?? '?')[0].toUpperCase()}
                      </span>
                    </div>

                    {/* Name + seat */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white truncate">{name}</p>
                      <p className="text-[11px] truncate" style={{ color: 'rgba(102,102,102,0.7)' }}>
                        {seat ? `Seat ${seat}` : r.passType === 'plusone' ? '+1 Guest' : 'Primary'}
                      </p>
                    </div>

                    {/* Time + badge */}
                    <div className="flex-shrink-0 text-right ml-2">
                      <p className="text-[11px] font-mono" style={{ color: 'rgba(102,102,102,0.7)' }}>
                        {new Date(r.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                      <div
                        className="inline-flex items-center justify-center rounded-full px-2 mt-1"
                        style={{ height: 18, background: cfg.badgeBg }}
                      >
                        <span className="text-[9px] font-bold" style={{ color: cfg.color }}>
                          {r.status === 'SUCCESS' ? '✓ in' : r.status === 'ALREADY_CHECKED_IN' ? '⚠ dup' : '✕ fail'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
