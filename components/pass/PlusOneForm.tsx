'use client'

import { useState } from 'react'

interface Props {
  attendeeId: string
  accent: string
  onSuccess: (updated: { plusOneName: string; plusOnePhone: string; plusOneQrPayload: string }) => void
}

export default function PlusOneForm({ attendeeId, accent, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/plusone/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendeeId, plusOneName: name, plusOnePhone: phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        return
      }
      onSuccess({
        plusOneName: data.attendee.plusOneName,
        plusOnePhone: data.attendee.plusOnePhone,
        plusOneQrPayload: data.attendee.plusOneQrPayload,
      })
    } catch {
      setError('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <div className="rounded-2xl p-5"
        style={{ background: '#161616', border: '1px solid #2a2a2a' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-white text-sm">Bring a +1 for free?</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>
              Your pass allows one guest. They&apos;ll get their own QR code via WhatsApp.
            </p>
          </div>
          <button onClick={() => setOpen(true)}
            className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold text-black"
            style={{ background: accent }}>
            Invite
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-5"
      style={{ background: '#161616', border: '1px solid #2a2a2a' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-white text-sm">Invite your +1</p>
        <button onClick={() => setOpen(false)}
          className="text-sm" style={{ color: '#888' }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs mb-1.5" style={{ color: '#888' }}>Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="+1's full name" required
            className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none"
            style={{ background: '#0A0A0F', border: '1px solid #2a2a2a' }} />
        </div>
        <div>
          <label className="block text-xs mb-1.5" style={{ color: '#888' }}>WhatsApp Number</label>
          <div className="flex">
            <span className="flex items-center px-3 text-sm rounded-l-lg flex-shrink-0"
              style={{ background: '#222', border: '1px solid #2a2a2a', borderRight: 'none', color: '#888' }}>
              +91
            </span>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="10-digit mobile" required type="tel"
              className="flex-1 rounded-r-lg px-3 py-2.5 text-sm text-white outline-none"
              style={{ background: '#0A0A0F', border: '1px solid #2a2a2a' }} />
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button type="submit" disabled={loading || !name || !phone}
          className="w-full py-3 rounded-lg text-sm font-semibold text-black disabled:opacity-50"
          style={{ background: accent }}>
          {loading ? 'Sending…' : 'Send Invite via WhatsApp'}
        </button>
      </form>
    </div>
  )
}
