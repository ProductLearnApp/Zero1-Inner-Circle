'use client'

import { useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'

type AttendeeStatus = 'NOT_SELECTED' | 'SELECTED' | 'REJECTED' | 'CHECKED_IN'

type Attendee = {
  id: string
  name: string
  phone: string
  status: AttendeeStatus
  seatLabel: string | null
  checkedIn: boolean
  checkedInAt: string | null
  passUrl: string | null
  notifiedAt: string | null
  plusOneName: string | null
  plusOnePhone: string | null
}

type Event = { id: string; name: string }

type StatusCfg = { bg: string; dot: string; text: string; label: string }

const STATUS_CONFIG: Record<AttendeeStatus, StatusCfg> = {
  NOT_SELECTED: { bg: '#1a1a1c', dot: '#878787',  text: '#878787',  label: 'Waitlisted'  },
  SELECTED:     { bg: '#1a2a10', dot: '#6fcf30',  text: '#6fcf30',  label: 'Selected'    },
  REJECTED:     { bg: '#1c1510', dot: '#c98a30',  text: '#c98a30',  label: 'Pending'     },
  CHECKED_IN:   { bg: '#0f1f2a', dot: '#30b0cf',  text: '#30b0cf',  label: 'Checked In'  },
}

const SETTABLE_STATUSES: AttendeeStatus[] = ['NOT_SELECTED', 'SELECTED', 'REJECTED']

function downloadSampleCSV() {
  const rows = [
    ['name', 'phone', 'status', 'seatLabel'],
    ['Arjun Mehta',  '+919876543210', 'selected',     'A-01'],
    ['Priya Sharma', '9876543211',    'selected',     'A-02'],
    ['Rohit Verma',  '919876543212',  'not_selected', ''    ],
    ['Sneha Kapoor', '+919876543213', 'rejected',     ''    ],
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'sample-attendees.csv'; a.click()
  URL.revokeObjectURL(url)
}

export default function AttendeesPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('ALL')
  const [dbError, setDbError] = useState<string | null>(null)
  const [noEvent, setNoEvent] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<Record<string, string>[] | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ added: number; updated: number; errors: string[] } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const [statusMenuId, setStatusMenuId] = useState<string | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadEvent() }, [])

  async function loadEvent() {
    const res = await fetch('/api/admin/event')
    if (!res.ok) {
      setDbError('Could not reach the database. Check that DATABASE_URL is set correctly in your Railway environment variables.')
      setLoading(false)
      return
    }
    const { event } = await res.json()
    if (!event) {
      setNoEvent(true)
      setLoading(false)
      return
    }
    setNoEvent(false); setDbError(null); setEvent(event)
    await loadAttendees(event.id)
  }

  async function loadAttendees(eventId: string) {
    setLoading(true)
    try {
      const params = new URLSearchParams({ eventId })
      if (filter !== 'ALL') params.set('status', filter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin/attendees?${params}`)
      if (res.ok) setAttendees((await res.json()).attendees)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (event) loadAttendees(event.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportResult(null); setImportError(null)
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length && result.data.length === 0) {
          setImportError('Could not parse CSV. Download the sample to check the format.')
          return
        }
        setPreview(result.data)
      },
    })
  }

  async function handleImport() {
    if (!preview) return
    if (!event) { setImportError('No event yet. Create one in Settings first.'); return }
    setImporting(true); setImportError(null)
    try {
      const res = await fetch('/api/admin/attendees/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: preview, eventId: event.id }),
      })
      const data = await res.json()
      if (!res.ok) { setImportError(data.error ?? `Server error ${res.status}`); return }
      setImportResult(data); setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
      await loadAttendees(event.id)
    } catch (e) {
      setImportError(String(e))
    } finally {
      setImporting(false)
    }
  }

  async function setStatus(id: string, status: AttendeeStatus) {
    setStatusMenuId(null)
    await fetch(`/api/admin/attendees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (event) loadAttendees(event.id)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this attendee?')) return
    await fetch(`/api/admin/attendees/${id}`, { method: 'DELETE' })
    if (event) loadAttendees(event.id)
  }

  async function handleNotify(id: string) {
    const res = await fetch(`/api/admin/attendees/${id}/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'selected' }),
    })
    alert(res.ok ? 'WhatsApp sent' : (await res.json()).error ?? 'Failed to send')
  }

  const filtered = attendees.filter(a => {
    const q = search.toLowerCase()
    return !q || a.name.toLowerCase().includes(q) || a.phone.includes(q)
  })

  const filterTabs = [
    { key: 'ALL',          label: 'All'          },
    { key: 'SELECTED',     label: 'Selected'     },
    { key: 'NOT_SELECTED', label: 'Waitlisted'   },
    { key: 'REJECTED',     label: 'Pending'      },
    { key: 'CHECKED_IN',   label: 'Checked In'   },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }} onClick={() => setStatusMenuId(null)}>

      {/* Page header */}
      <div className="flex items-end justify-between px-8 pt-6 pb-4 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white leading-none">Attendees</h1>
          <p className="text-[13px] mt-2" style={{ color: 'rgba(102,102,102,0.7)' }}>
            {attendees.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadSampleCSV}
            className="flex items-center gap-1.5 h-10 px-4 rounded-lg text-[13px] font-medium transition hover:bg-white/5"
            style={{ background: '#161616', border: '1px solid #252525', color: 'rgba(255,255,255,0.85)' }}
          >
            ↓&nbsp;&nbsp;Sample CSV
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 h-10 px-4 rounded-lg text-[13px] font-semibold text-[#0a0a0f] transition hover:opacity-90"
            style={{ background: '#f2ba30' }}
          >
            +&nbsp;&nbsp;Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <div className="px-8 pb-8">

        {/* Error banners */}
        {dbError && (
          <div className="mb-5 rounded-xl p-4" style={{ background: '#1a0a00', border: '1px solid #5a2a00' }}>
            <p className="text-sm font-semibold text-orange-400 mb-1">Database error</p>
            <p className="text-xs" style={{ color: '#aaa' }}>{dbError}</p>
          </div>
        )}
        {noEvent && !dbError && (
          <div className="mb-5 rounded-xl p-4 flex items-center justify-between gap-4"
            style={{ background: 'rgba(242,186,48,0.08)', border: '1px solid rgba(242,186,48,0.25)' }}>
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--accent)' }}>No event created yet</p>
              <p className="text-xs" style={{ color: '#aaa' }}>
                Create your event first before importing attendees.
              </p>
            </div>
            <a href="/admin/settings"
              className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold text-black"
              style={{ background: 'var(--accent)' }}>
              Go to Settings →
            </a>
          </div>
        )}
        {importError && (
          <div className="mb-4 rounded-xl p-4 text-sm" style={{ background: '#2a0f0f', border: '1px solid #5a2020' }}>
            <p className="text-red-400">Import failed: {importError}</p>
          </div>
        )}
        {importResult && (
          <div className="mb-4 rounded-xl p-4 text-sm" style={{ background: '#0f2a10', border: '1px solid #2a5a20' }}>
            <p className="text-green-400 font-medium">
              Import complete — {importResult.added} added, {importResult.updated} updated
            </p>
            {importResult.errors.length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {importResult.errors.map((e, i) => (
                  <li key={i} className="text-red-400 text-xs">{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* CSV Preview */}
        {preview && (
          <div className="mb-6 rounded-xl overflow-hidden" style={{ background: '#161616', border: '1px solid #252525' }}>
            <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: '#252525' }}>
              <p className="text-sm font-medium text-white">
                Preview — {preview.length} rows
                <span className="ml-2 text-xs font-normal" style={{ color: '#666' }}>
                  columns: name, phone, status, seatLabel
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = '' }}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{ color: '#666' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0a0a0f] disabled:opacity-50"
                  style={{ background: '#f2ba30' }}
                >
                  {importing ? 'Importing…' : 'Confirm Import'}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid #252525' }}>
                    {Object.keys(preview[0] ?? {}).map(k => (
                      <th key={k} className="px-4 py-2 text-left font-medium" style={{ color: '#666' }}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #1e1e1e' }}>
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="px-4 py-2" style={{ color: 'rgba(255,255,255,0.8)' }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                  {preview.length > 10 && (
                    <tr>
                      <td colSpan={Object.keys(preview[0]).length} className="px-4 py-2 text-xs text-center" style={{ color: '#666' }}>
                        …and {preview.length - 10} more rows
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Search + filter row */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name / phone…"
            className="h-10 rounded-lg px-3 text-[13px] text-white outline-none flex-1 min-w-44"
            style={{ background: '#0f0f13', border: '1px solid #252525', color: 'rgba(255,255,255,0.85)' }}
          />
          <div className="flex gap-1.5 flex-wrap">
            {filterTabs.map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className="h-10 px-4 rounded-lg text-[13px] font-medium transition"
                style={filter === t.key
                  ? { background: '#f2ba30', color: '#0a0a0f', fontWeight: 600 }
                  : { background: '#161616', border: '0.6px solid #252525', color: 'rgba(102,102,102,0.85)' }
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table card */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(13,13,15,0.5)', border: '0.8px solid #252525' }}
        >
          {/* Table header */}
          <div
            className="grid text-[12px] font-medium px-6 py-3 border-b"
            style={{
              color: 'rgba(102,102,102,0.8)',
              borderColor: 'rgba(37,37,37,0.6)',
              gridTemplateColumns: '1fr 1fr 140px 160px 72px 40px 40px',
            }}
          >
            <span>Name</span>
            <span>Phone</span>
            <span>Status</span>
            <span>Check-in</span>
            <span style={{ gridColumn: '5 / 8', textAlign: 'right' }}>Actions</span>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-5 h-5 rounded-full border-2 animate-spin"
                style={{ borderColor: '#f2ba30', borderTopColor: 'transparent' }} />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-16 text-sm" style={{ color: 'rgba(102,102,102,0.7)' }}>
              No attendees found
            </p>
          ) : (
            <div>
              {filtered.map((a, idx) => {
                const sc = STATUS_CONFIG[a.status]
                const isLast = idx === filtered.length - 1
                return (
                  <div
                    key={a.id}
                    className="grid items-center px-6 hover:bg-white/[0.03] transition-colors"
                    style={{
                      gridTemplateColumns: '1fr 1fr 140px 160px 72px 40px 40px',
                      height: 60,
                      borderBottom: isLast ? 'none' : '1px solid rgba(37,37,37,0.4)',
                    }}
                  >
                    {/* Name + optional +1 indicator */}
                    <div className="flex flex-col min-w-0 pr-4">
                      <span className="text-sm font-semibold text-white truncate">{a.name}</span>
                      {a.plusOneName && (
                        <span className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(180,160,80,0.8)' }}>
                          {a.plusOneName}&rsquo;s +1
                        </span>
                      )}
                    </div>

                    {/* Phone */}
                    <span className="text-[13px] font-mono truncate pr-4" style={{ color: 'rgba(102,102,102,0.75)' }}>
                      {a.phone}
                    </span>

                    {/* Status dropdown */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setStatusMenuId(statusMenuId === a.id ? null : a.id)}
                        className="flex items-center gap-2 h-7 px-3 rounded-full text-xs font-semibold"
                        style={{ background: sc.bg, color: sc.text }}
                        disabled={a.status === 'CHECKED_IN'}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                        {sc.label}
                        {a.status !== 'CHECKED_IN' && (
                          <span className="text-[9px] opacity-70">▾</span>
                        )}
                      </button>

                      {statusMenuId === a.id && (
                        <div
                          className="absolute left-0 top-full mt-1 z-30 rounded-lg overflow-hidden shadow-xl"
                          style={{ background: '#222', border: '1px solid #333', minWidth: 140 }}
                        >
                          {SETTABLE_STATUSES.map(s => {
                            const c = STATUS_CONFIG[s]
                            return (
                              <button
                                key={s}
                                onClick={() => setStatus(a.id, s)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-white/10 transition-colors"
                                style={{ color: a.status === s ? c.text : '#ccc' }}
                              >
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
                                {c.label}
                                {a.status === s && <span className="ml-auto">✓</span>}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Check-in */}
                    <div>
                      {a.checkedIn ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#30b0cf' }} />
                          <span className="text-xs font-medium" style={{ color: '#30b0cf' }}>Checked In</span>
                          {a.checkedInAt && (
                            <span className="text-xs font-mono" style={{ color: 'rgba(102,102,102,0.7)' }}>
                              {new Date(a.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm" style={{ color: 'rgba(102,102,102,0.4)' }}>—</span>
                      )}
                    </div>

                    {/* Col 5 — Pass */}
                    <div className="flex justify-end">
                      {a.passUrl ? (
                        <a
                          href={a.passUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="h-7 px-2.5 rounded-md text-xs font-semibold flex items-center gap-1 whitespace-nowrap"
                          style={{ background: '#1a170a', border: '0.6px solid #4d3d0f', color: '#f2ba30' }}
                        >
                          Pass <span style={{ lineHeight: 1 }}>↗</span>
                        </a>
                      ) : <span />}
                    </div>

                    {/* Col 6 — WhatsApp */}
                    <div className="flex justify-center">
                      {(a.status === 'SELECTED' || a.status === 'CHECKED_IN') ? (
                        <button
                          onClick={() => handleNotify(a.id)}
                          title="Send WhatsApp"
                          className="w-7 h-7 rounded-md flex items-center justify-center flex-col gap-[3px]"
                          style={{ background: '#1a1a1d', border: '0.6px solid #252525' }}
                        >
                          <div className="w-3.5 h-[1.5px] rounded-sm" style={{ background: 'rgba(255,255,255,0.7)' }} />
                          <div className="w-2.5 h-[1.5px] rounded-sm" style={{ background: 'rgba(255,255,255,0.7)' }} />
                          <div className="w-2 h-[1.5px] rounded-sm" style={{ background: 'rgba(255,255,255,0.5)' }} />
                        </button>
                      ) : <span />}
                    </div>

                    {/* Col 7 — Delete */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-base font-medium"
                        style={{ background: '#1f0d0d', border: '0.6px solid #401414', color: '#cf4444' }}
                      >
                        ×
                      </button>
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
