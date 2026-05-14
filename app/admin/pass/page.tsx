'use client'

import { useEffect, useState } from 'react'

const DEFAULT_POINTS = [
  'Passes for Zero1 Inner Circle are non-transferable. Only the participant and their pre-invited +1 will be allowed into the venue',
  'Both the participant and their +1 must carry valid government issued IDs for verification',
  'People under the age of 18 will not be permitted inside the premises',
  'The event starts at 10:30 AM sharp. Please reach the venue at least 15 minutes before that',
  'Passes for Inner Circle events are non-cancellable and non-refundable',
  'Sharp objects, prohibited substances, lighters, e-cigarettes, food items, etc. are prohibited',
  'For any medication you wish to carry, please bring a doctor-signed prescription',
].join('\n')

type PassForm = {
  eventId: string
  mapsUrl: string
  mapImageUrl: string
  logoUrl: string
  passBackgroundUrl: string
  accentColor: string
  allowPlusOne: boolean
  pointsToRemember: string
}

const DEFAULT_FORM: PassForm = {
  eventId: '',
  mapsUrl: '',
  mapImageUrl: '',
  logoUrl: '',
  passBackgroundUrl: '',
  accentColor: '#F2BA30',
  allowPlusOne: true,
  pointsToRemember: DEFAULT_POINTS,
}


export default function AdminPassPage() {
  const [form, setForm]       = useState<PassForm>(DEFAULT_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/event')
        if (!res.ok) { setLoading(false); return }
        const { event } = await res.json()
        if (event) {
          const s = event.settings
          setForm({
            eventId:          event.id,
            mapsUrl:          s?.mapsUrl          ?? '',
            mapImageUrl:      s?.mapImageUrl      ?? '',
            logoUrl:          s?.logoUrl          ?? '',
            passBackgroundUrl: s?.passBackgroundUrl ?? '',
            accentColor:      s?.accentColor      ?? '#F2BA30',
            allowPlusOne:     s?.allowPlusOne     ?? true,
            pointsToRemember: Array.isArray(s?.passPointsToRemember)
              ? (s.passPointsToRemember as string[]).join('\n')
              : DEFAULT_POINTS,
          })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function set(field: keyof PassForm, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)

    const settingsPayload = {
      mapsUrl:          form.mapsUrl          || undefined,
      mapImageUrl:      form.mapImageUrl      || undefined,
      logoUrl:          form.logoUrl          || undefined,
      passBackgroundUrl: form.passBackgroundUrl || undefined,
      accentColor:      form.accentColor      || undefined,
      allowPlusOne:     form.allowPlusOne,
      passPointsToRemember: form.pointsToRemember
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean),
    }

    try {
      if (!form.eventId) {
        setError('No event found. Create one via the Settings page first.')
        return
      }
      const res = await fetch('/api/admin/event', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: form.eventId, settings: settingsPayload }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? `Failed to save (${res.status})`)
        return
      }
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-5 h-5 rounded-full border-2 animate-spin"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center h-16 mb-2">
        <h1 className="text-2xl font-bold text-white">Pass</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
        Configure everything shown on the attendee pass page.
      </p>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Venue Map */}
        <Section title="Venue Map">
          <Field
            label="Map Image URL"
            hint="The thumbnail image shown in the map strip. Use a static map screenshot or any venue photo. Recommended: 780 × 124 px."
          >
            <Input
              value={form.mapImageUrl}
              onChange={v => set('mapImageUrl', v)}
              placeholder="https://…/venue-map.jpg"
            />
          </Field>
          <Field
            label="Location Link"
            hint="Google Maps link for the venue. The map thumbnail becomes a tap-to-open link when this is set."
          >
            <Input
              value={form.mapsUrl}
              onChange={v => set('mapsUrl', v)}
              placeholder="https://maps.google.com/?q=28.5355,77.3910"
            />
          </Field>
          {form.mapsUrl && (
            <a
              href={form.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs"
              style={{ color: 'var(--accent)' }}
            >
              Test link ↗
            </a>
          )}
        </Section>

        {/* Pass Appearance */}
        <Section title="Pass Appearance">
          <Field label="Logo URL" hint="Replaces the default ZERO1 wordmark on the ticket. Transparent PNG recommended.">
            <Input value={form.logoUrl} onChange={v => set('logoUrl', v)}
              placeholder="https://…/logo.png" />
          </Field>
          <Field label="Pass Background URL" hint="Optional background texture/image for the ticket card.">
            <Input value={form.passBackgroundUrl} onChange={v => set('passBackgroundUrl', v)}
              placeholder="https://…/texture.png" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Accent Color" hint="QR dot colour and button tint.">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.accentColor}
                  onChange={e => set('accentColor', e.target.value)}
                  className="h-9 w-12 rounded cursor-pointer"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg)', padding: '2px' }}
                />
                <Input value={form.accentColor} onChange={v => set('accentColor', v)}
                  placeholder="#F2BA30" />
              </div>
            </Field>
            <Field label="Allow +1" hint="Show the +1 invite flow on the pass page.">
              <label className="flex items-center gap-2 h-9 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.allowPlusOne}
                  onChange={e => set('allowPlusOne', e.target.checked)}
                  className="w-4 h-4 accent-yellow-400"
                />
                <span className="text-sm text-white">Enabled</span>
              </label>
            </Field>
          </div>
        </Section>

        {/* Points to Remember */}
        <Section title="Points to Remember">
          <Field
            label="Bullet points"
            hint="One item per line — each line becomes a numbered point on the pass page."
          >
            <textarea
              value={form.pointsToRemember}
              onChange={e => set('pointsToRemember', e.target.value)}
              rows={9}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 transition resize-y"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', ['--tw-ring-color' as string]: 'var(--accent)' }}
            />
          </Field>
        </Section>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-3 rounded-lg text-black font-semibold text-sm disabled:opacity-50"
            style={{ background: 'var(--accent)' }}>
            {saving ? 'Saving…' : 'Save Pass Settings'}
          </button>
          {saved && <span className="text-sm text-green-400">Saved ✓</span>}
        </div>

      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6 space-y-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <h2 className="text-sm font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
        {label}
      </label>
      {children}
      {hint && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{hint}</p>}
    </div>
  )
}

function Input({
  value, onChange, placeholder, type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 transition"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        '--tw-ring-color': 'var(--accent)',
      } as React.CSSProperties}
    />
  )
}
