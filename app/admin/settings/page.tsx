'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type EventForm = {
  id: string
  name: string
  date: string
  time: string
  city: string
  venue: string
  price: string
  maxCapacity: number
  heroImageUrl: string
  settings: {
    accentColor: string
    allowPlusOne: boolean
    logoUrl: string
    passBackgroundUrl: string
    whatsappTemplateSelected: string
    whatsappTemplateReminder: string
    whatsappTemplatePlusOne: string
  }
}

const DEFAULTS: EventForm = {
  id: '',
  name:  process.env.NEXT_PUBLIC_EVENT_NAME  ?? '',
  date:  process.env.NEXT_PUBLIC_EVENT_DATE  ?? '',
  time:  process.env.NEXT_PUBLIC_EVENT_TIME  ?? '',
  city:  process.env.NEXT_PUBLIC_EVENT_CITY  ?? '',
  venue: process.env.NEXT_PUBLIC_EVENT_VENUE ?? '',
  price: '₹3,000',
  maxCapacity: 30,
  heroImageUrl: '',
  settings: {
    accentColor: '#F2BA30',
    allowPlusOne: true,
    logoUrl: '',
    passBackgroundUrl: '',
    whatsappTemplateSelected: '',
    whatsappTemplateReminder: '',
    whatsappTemplatePlusOne: '',
  },
}

export default function SettingsPage() {
  const [form, setForm]       = useState<EventForm>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [noEvent, setNoEvent] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/event')
        if (!res.ok) { setLoading(false); return }
        const { event } = await res.json()
        if (!event) {
          setNoEvent(true)
        } else {
          setNoEvent(false)
          const s = event.settings
          setForm({
            id:           event.id,
            name:         event.name         ?? '',
            date:         event.date         ?? '',
            time:         event.time         ?? '',
            city:         event.city         ?? '',
            venue:        event.venue        ?? '',
            price:        event.price        ?? '₹3,000',
            maxCapacity:  event.maxCapacity  ?? 30,
            heroImageUrl: event.heroImageUrl ?? '',
            settings: {
              accentColor:              s?.accentColor              ?? '#F2BA30',
              allowPlusOne:             s?.allowPlusOne             ?? true,
              logoUrl:                  s?.logoUrl                  ?? '',
              passBackgroundUrl:        s?.passBackgroundUrl        ?? '',
              whatsappTemplateSelected: s?.whatsappTemplateSelected ?? '',
              whatsappTemplateReminder: s?.whatsappTemplateReminder ?? '',
              whatsappTemplatePlusOne:  s?.whatsappTemplatePlusOne  ?? '',
            },
          })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function set(field: keyof EventForm, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function setSetting(field: keyof EventForm['settings'], value: unknown) {
    setForm(f => ({ ...f, settings: { ...f.settings, [field]: value } }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)

    const payload = {
      name:         form.name,
      date:         form.date,
      time:         form.time,
      city:         form.city,
      venue:        form.venue,
      price:        form.price        || undefined,
      maxCapacity:  Number(form.maxCapacity),
      heroImageUrl: form.heroImageUrl || undefined,
      settings: {
        accentColor:              form.settings.accentColor,
        allowPlusOne:             form.settings.allowPlusOne,
        logoUrl:                  form.settings.logoUrl                  || undefined,
        passBackgroundUrl:        form.settings.passBackgroundUrl        || undefined,
        whatsappTemplateSelected: form.settings.whatsappTemplateSelected || undefined,
        whatsappTemplateReminder: form.settings.whatsappTemplateReminder || undefined,
        whatsappTemplatePlusOne:  form.settings.whatsappTemplatePlusOne  || undefined,
      },
    }

    try {
      const res = await fetch('/api/admin/event', {
        method:  noEvent ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(noEvent ? payload : { id: form.id, ...payload }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? `Failed to save (${res.status})`)
        return
      }

      const { event } = await res.json()
      setForm(f => ({ ...f, id: event.id }))
      setNoEvent(false)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center h-16 mb-2">
        {noEvent && (
          <span className="mr-3 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(242,186,48,0.15)', color: 'var(--accent)' }}>
            First-time setup
          </span>
        )}
        <h1 className="text-2xl font-bold text-white">
          {noEvent ? 'Create your event' : 'Settings'}
        </h1>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
        {noEvent
          ? 'Fill in the details below to set up your event. You can always edit them later.'
          : 'Event config & WhatsApp templates'}
      </p>

      {noEvent && (
        <div className="mb-6 rounded-xl px-4 py-3 text-sm flex items-center gap-2"
          style={{ background: 'rgba(242,186,48,0.08)', border: '1px solid rgba(242,186,48,0.25)', color: 'var(--accent)' }}>
          <span>No event found in the database.</span>
          <Link href="/admin/attendees" className="underline underline-offset-2 ml-auto">
            ← Back to Attendees
          </Link>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Event details */}
        <Section title="Event Details">
          <Field label="Event Name" required>
            <Input value={form.name} onChange={v => set('name', v)} placeholder="Zero1 Money Circle" required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" required>
              <Input value={form.date} onChange={v => set('date', v)} placeholder="May 24, 2025" required />
            </Field>
            <Field label="Time" required>
              <Input value={form.time} onChange={v => set('time', v)} placeholder="6:00 PM – 9:00 PM" required />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" required>
              <Input value={form.city} onChange={v => set('city', v)} placeholder="Mumbai" required />
            </Field>
            <Field label="Max Capacity">
              <Input type="number" value={String(form.maxCapacity)} onChange={v => set('maxCapacity', v)} placeholder="30" />
            </Field>
          </div>
          <Field label="Venue" required>
            <Input value={form.venue} onChange={v => set('venue', v)} placeholder="TBD — sent 24 hrs before" required />
          </Field>
        </Section>

        {/* Images */}
        <Section title="Branding & Images">
          <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
            Paste public image URLs (Supabase Storage, Cloudinary, etc.)
          </p>
          <Field label="Hero Image URL">
            <Input value={form.heroImageUrl} onChange={v => set('heroImageUrl', v)}
              placeholder="https://…/hero.jpg" />
          </Field>
          <Field label="Pass Logo URL">
            <Input value={form.settings.logoUrl} onChange={v => setSetting('logoUrl', v)}
              placeholder="https://…/logo.png" />
          </Field>
          <Field label="Pass Background URL">
            <Input value={form.settings.passBackgroundUrl} onChange={v => setSetting('passBackgroundUrl', v)}
              placeholder="https://…/bg.png" />
          </Field>
          <Field label="Accent Color">
            <div className="flex items-center gap-3">
              <input type="color" value={form.settings.accentColor}
                onChange={e => setSetting('accentColor', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0"
                style={{ background: 'none' }} />
              <Input value={form.settings.accentColor} onChange={v => setSetting('accentColor', v)}
                placeholder="#F2BA30" />
            </div>
          </Field>
        </Section>

        {/* Event price */}
        <Section title="Ticket Details">
          <Field label="Price per head" hint="Displayed on the landing page (e.g. ₹3,000)">
            <Input value={form.price} onChange={v => set('price', v)} placeholder="₹3,000" />
          </Field>
        </Section>

        {/* +1 */}
        <Section title="Plus One">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" checked={form.settings.allowPlusOne}
                onChange={e => setSetting('allowPlusOne', e.target.checked)}
                className="sr-only" />
              <div className="w-10 h-6 rounded-full transition-colors"
                style={{ background: form.settings.allowPlusOne ? 'var(--accent)' : 'var(--border)' }} />
              <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                style={{ transform: form.settings.allowPlusOne ? 'translateX(16px)' : 'translateX(0)' }} />
            </div>
            <span className="text-sm text-white">Allow attendees to bring a +1</span>
          </label>
        </Section>

        {/* WhatsApp — only show for existing events; not critical for first setup */}
        {!noEvent && (
          <Section title="WhatsApp Templates (Gupshup IDs)">
            <Field label="Selected Template ID"
              hint="Params: {{name}}, {{passUrl}}">
              <Input value={form.settings.whatsappTemplateSelected}
                onChange={v => setSetting('whatsappTemplateSelected', v)}
                placeholder="template-id-from-gupshup" />
            </Field>
            <Field label="Reminder Template ID"
              hint="Params: {{name}}, {{date}}, {{venue}}">
              <Input value={form.settings.whatsappTemplateReminder}
                onChange={v => setSetting('whatsappTemplateReminder', v)}
                placeholder="template-id-from-gupshup" />
            </Field>
            <Field label="+1 Invite Template ID"
              hint="Params: {{plusOneName}}, {{primaryName}}, {{passUrl}}">
              <Input value={form.settings.whatsappTemplatePlusOne}
                onChange={v => setSetting('whatsappTemplatePlusOne', v)}
                placeholder="template-id-from-gupshup" />
            </Field>
          </Section>
        )}

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-3 rounded-lg text-black font-semibold text-sm disabled:opacity-50"
            style={{ background: 'var(--accent)' }}>
            {saving
              ? (noEvent ? 'Creating…' : 'Saving…')
              : (noEvent ? 'Create Event' : 'Save Settings')}
          </button>
          {saved && (
            <span className="text-sm text-green-400">
              {noEvent ? 'Event created ✓' : 'Saved ✓'}
            </span>
          )}
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

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
        {label}{required && <span className="ml-0.5" style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      {children}
      {hint && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{hint}</p>}
    </div>
  )
}

function Input({
  value, onChange, placeholder, type = 'text', required,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 transition"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        '--tw-ring-color': 'var(--accent)',
      } as React.CSSProperties} />
  )
}
