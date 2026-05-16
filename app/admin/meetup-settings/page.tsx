'use client'

import { useEffect, useState } from 'react'

type ThingsToKnowRow  = { text: string; iconUrl: string }
type SelectionStepRow = { icon: string; iconSize: string; title: string; body: string }
type ActivityFormRow  = { icon: string; title: string; description: string }
type TimelineFormRow  = { time: string; title: string; description: string; imageUrl: string }

type MeetupSettingsForm = {
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
    // Hero
    heroSubtitle: string
    aboutText: string
    // Event card
    eventCardImageUrl: string
    eventCardSubtitle: string
    // About
    eventAbout: string
    missionFormUrl: string
    sessionDescription: string
    // Branding
    accentColor: string
    navLogoUrl: string
    logoUrl: string
    passBackgroundUrl: string
    // Partnership
    partnerName: string
    partnerLogoUrl: string
    // Social
    instagramUrl: string
    emailAddress: string
    // Donation
    donationText: string
    donationImage1Url: string
    donationImage2Url: string
    donationImage3Url: string
    // Operational
    allowPlusOne: boolean
    // Structured builders
    activities: ActivityFormRow[]
    timeline: TimelineFormRow[]
    thingsToKnow: ThingsToKnowRow[]
    selectionProcess: SelectionStepRow[]
    // WhatsApp
    whatsappTemplateSelected: string
    whatsappTemplateReminder: string
    whatsappTemplatePlusOne: string
  }
}

const BLANK_ACTIVITY_ROW:  ActivityFormRow  = { icon: '', title: '', description: '' }
const BLANK_TIMELINE_ROW:  TimelineFormRow  = { time: '', title: '', description: '', imageUrl: '' }
const BLANK_KNOW_ROW:      ThingsToKnowRow  = { text: '', iconUrl: '' }
const BLANK_STEP_ROW:      SelectionStepRow = { icon: '', iconSize: '32', title: '', body: '' }

const DEFAULTS: MeetupSettingsForm = {
  id: '',
  name: '',
  date: '',
  time: '',
  city: '',
  venue: '',
  price: '₹3,000',
  maxCapacity: 30,
  heroImageUrl: '',
  settings: {
    heroSubtitle: 'An offline community to solve REAL personal finance problems',
    aboutText: '',
    eventCardImageUrl: '',
    eventCardSubtitle: '',
    eventAbout: '',
    missionFormUrl: '',
    sessionDescription: '',
    accentColor: '#F2BA30',
    navLogoUrl: '',
    logoUrl: '',
    passBackgroundUrl: '',
    partnerName: '',
    partnerLogoUrl: '',
    instagramUrl: '',
    emailAddress: '',
    donationText: 'All earnings after covering event costs are donated to charity. Every ticket you buy contributes directly to causes supported by the Zero1 community.',
    donationImage1Url: '',
    donationImage2Url: '',
    donationImage3Url: '',
    allowPlusOne: true,
    activities: [BLANK_ACTIVITY_ROW],
    timeline: [BLANK_TIMELINE_ROW],
    thingsToKnow: [BLANK_KNOW_ROW],
    selectionProcess: [BLANK_STEP_ROW],
    whatsappTemplateSelected: '',
    whatsappTemplateReminder: '',
    whatsappTemplatePlusOne: '',
  },
}

export default function MeetupSettingsPage() {
  const [form, setForm]         = useState<MeetupSettingsForm>(DEFAULTS)
  const [loading, setLoading]   = useState(true)
  const [noEvent, setNoEvent]   = useState(false)
  const [loadWarn, setLoadWarn] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/event')
        if (!res.ok) { setLoadWarn(true); setLoading(false); return }
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
              heroSubtitle:       s?.heroSubtitle       ?? DEFAULTS.settings.heroSubtitle,
              aboutText:          s?.aboutText          ?? '',
              eventCardImageUrl:  s?.eventCardImageUrl  ?? '',
              eventCardSubtitle:  s?.eventCardSubtitle  ?? '',
              eventAbout:         s?.eventAbout         ?? '',
              missionFormUrl:     s?.missionFormUrl     ?? '',
              sessionDescription: s?.sessionDescription ?? '',
              accentColor:        s?.accentColor        ?? '#F2BA30',
              navLogoUrl:         s?.navLogoUrl         ?? '',
              logoUrl:            s?.logoUrl            ?? '',
              passBackgroundUrl:  s?.passBackgroundUrl  ?? '',
              partnerName:        s?.partnerName        ?? '',
              partnerLogoUrl:     s?.partnerLogoUrl     ?? '',
              instagramUrl:       s?.instagramUrl       ?? '',
              emailAddress:       s?.emailAddress       ?? '',
              donationText:       s?.donationText       ?? DEFAULTS.settings.donationText,
              donationImage1Url:  s?.donationImage1Url  ?? '',
              donationImage2Url:  s?.donationImage2Url  ?? '',
              donationImage3Url:  s?.donationImage3Url  ?? '',
              allowPlusOne:       s?.allowPlusOne       ?? true,
              // Activities — migrate old keyword icons to empty string
              activities: Array.isArray(s?.activities) && s.activities.length
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (s.activities as any[]).map((r: any) => ({
                    icon: (r.icon?.startsWith('http') || r.icon?.startsWith('/')) ? r.icon : '',
                    title: r.title ?? '',
                    description: r.description ?? '',
                  }))
                : [BLANK_ACTIVITY_ROW],
              // Timeline
              timeline: Array.isArray(s?.timeline) && s.timeline.length
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (s.timeline as any[]).map((r: any) => ({
                    time: r.time ?? '',
                    title: r.title ?? '',
                    description: r.description ?? '',
                    imageUrl: r.imageUrl ?? '',
                  }))
                : [BLANK_TIMELINE_ROW],
              // Things to Know — handle both old string[] and new ThingsToKnowRow[]
              thingsToKnow: Array.isArray(s?.thingsToKnow) && s.thingsToKnow.length
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (s.thingsToKnow as any[]).map((r: any) =>
                    typeof r === 'string' ? { text: r, iconUrl: '' } : { text: r.text ?? '', iconUrl: r.iconUrl ?? '' }
                  )
                : [BLANK_KNOW_ROW],
              // Selection Process
              selectionProcess: Array.isArray(s?.selectionProcess) && s.selectionProcess.length
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (s.selectionProcess as any[]).map((r: any) => ({
                    icon: r.icon ?? '',
                    iconSize: String(r.iconSize ?? 32),
                    title: r.title ?? '',
                    body: r.body ?? '',
                  }))
                : [BLANK_STEP_ROW],
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

  function set(field: keyof MeetupSettingsForm, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function setSetting(field: keyof MeetupSettingsForm['settings'], value: unknown) {
    setForm(f => ({ ...f, settings: { ...f.settings, [field]: value } }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)

    const validActivities = form.settings.activities.filter(r => r.title.trim())
    const parsedActivities = validActivities.length
      ? validActivities.map(r => ({ icon: r.icon.trim() || undefined, title: r.title, description: r.description }))
      : undefined

    const validTimeline = form.settings.timeline.filter(r => r.title.trim())
    const parsedTimeline = validTimeline.length
      ? validTimeline.map(r => ({ time: r.time, title: r.title, description: r.description, imageUrl: r.imageUrl }))
      : undefined

    const validKnow = form.settings.thingsToKnow.filter(r => r.text.trim())
    const parsedThingsToKnow = validKnow.length
      ? validKnow.map(r => ({ text: r.text, ...(r.iconUrl.trim() ? { iconUrl: r.iconUrl } : {}) }))
      : undefined

    const validSteps = form.settings.selectionProcess.filter(r => r.title.trim() || r.icon.trim())
    const parsedSelectionProcess = validSteps.length
      ? validSteps.map(r => ({ icon: r.icon, iconSize: Number(r.iconSize) || 32, title: r.title, body: r.body }))
      : undefined

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
        heroSubtitle:       form.settings.heroSubtitle       || undefined,
        aboutText:          form.settings.aboutText          || undefined,
        eventCardImageUrl:  form.settings.eventCardImageUrl  || undefined,
        eventCardSubtitle:  form.settings.eventCardSubtitle  || null,
        eventAbout:         form.settings.eventAbout         || undefined,
        missionFormUrl:     form.settings.missionFormUrl     || undefined,
        sessionDescription: form.settings.sessionDescription || undefined,
        accentColor:        form.settings.accentColor,
        allowPlusOne:       form.settings.allowPlusOne,
        navLogoUrl:         form.settings.navLogoUrl         || undefined,
        logoUrl:            form.settings.logoUrl            || undefined,
        passBackgroundUrl:  form.settings.passBackgroundUrl  || undefined,
        partnerName:        form.settings.partnerName        || undefined,
        partnerLogoUrl:     form.settings.partnerLogoUrl     || undefined,
        instagramUrl:       form.settings.instagramUrl       || undefined,
        emailAddress:       form.settings.emailAddress       || undefined,
        donationText:       form.settings.donationText       || undefined,
        donationImage1Url:  form.settings.donationImage1Url  || undefined,
        donationImage2Url:  form.settings.donationImage2Url  || undefined,
        donationImage3Url:  form.settings.donationImage3Url  || undefined,
        activities:         parsedActivities    ?? undefined,
        timeline:           parsedTimeline      ?? undefined,
        thingsToKnow:       parsedThingsToKnow  ?? undefined,
        selectionProcess:   parsedSelectionProcess ?? undefined,
        whatsappTemplateSelected: form.settings.whatsappTemplateSelected || undefined,
        whatsappTemplateReminder: form.settings.whatsappTemplateReminder || undefined,
        whatsappTemplatePlusOne:  form.settings.whatsappTemplatePlusOne  || undefined,
      },
    }

    try {
      const res = await fetch('/api/admin/event', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form.id ? { id: form.id, ...payload } : payload),
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
      <div className="flex items-center h-16 mb-2">
        {noEvent && (
          <span className="mr-3 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(242,186,48,0.15)', color: 'var(--accent)' }}>
            First-time setup
          </span>
        )}
        <h1 className="text-2xl font-bold text-white">Meetup Settings</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
        Configure everything shown on the public landing page.
      </p>

      {loadWarn && (
        <div className="mb-6 rounded-xl px-4 py-3 text-sm"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
          Could not load current settings — your save will still work.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        {/* ── Event Details ── */}
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
            <Field label="Venue" required>
              <Input value={form.venue} onChange={v => set('venue', v)} placeholder="TBD — sent 24 hrs before" required />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price" hint='Shown as "X/- per head" on the landing page'>
              <Input value={form.price} onChange={v => set('price', v)} placeholder="₹3,000" />
            </Field>
            <Field label="Max Capacity" hint='Shown as "Only X passes"'>
              <Input type="number" value={String(form.maxCapacity)} onChange={v => set('maxCapacity', v)} placeholder="30" />
            </Field>
          </div>
        </Section>

        {/* ── Hero ── */}
        <Section title="Hero">
          <Field label="Hero Image URL" hint="Full-width background photo. Recommended: 1440 × 678 px">
            <Input value={form.heroImageUrl} onChange={v => set('heroImageUrl', v)} placeholder="https://…/crowd-photo.jpg" />
          </Field>
          <Field label="Hero Subtitle" hint='Line below the wordmark, e.g. "An offline community to solve REAL personal finance problems"'>
            <Input value={form.settings.heroSubtitle} onChange={v => setSetting('heroSubtitle', v)}
              placeholder="An offline community to solve REAL personal finance problems" />
          </Field>
          <Field label="Hero Bullet Points" hint="One bullet per line — shown as ◆ list below the subtitle">
            <Textarea value={form.settings.aboutText} onChange={v => setSetting('aboutText', v)}
              placeholder={'Quarterly meet-ups across up to 8 cities\nTopic-based events for focused learning\nCurated hands-on activities to build technical skills\nAll earnings after covering event costs are donated to charity'}
              rows={5} />
          </Field>
        </Section>

        {/* ── Upcoming Events Card ── */}
        <Section title="Upcoming Events Card">
          <Field label="Card Image URL" hint="Background image for the event card. Recommended: 1920 × 1080 px (16:9)">
            <Input value={form.settings.eventCardImageUrl} onChange={v => setSetting('eventCardImageUrl', v)}
              placeholder="https://…/event-card.jpg" />
          </Field>
          <Field label="Card Subtitle" hint='Short line below the event name on the card'>
            <Input value={form.settings.eventCardSubtitle} onChange={v => setSetting('eventCardSubtitle', v)}
              placeholder="Curating the right mix of investments" />
          </Field>
        </Section>

        {/* ── About the Event ── */}
        <Section title="About the Event">
          <Field label="Intro Paragraph" hint="Shown in the event description section">
            <Textarea value={form.settings.eventAbout} onChange={v => setSetting('eventAbout', v)}
              placeholder="Starting your investing journey can feel intimidating…" rows={3} />
          </Field>
          <Field label="Session Description" hint="Shown below the intro (what happens in this session)">
            <Textarea value={form.settings.sessionDescription} onChange={v => setSetting('sessionDescription', v)}
              placeholder="In this session, we will figure out…" rows={3} />
          </Field>
          <Field label="Mission Form URL" hint='Link the "Start your mission" button points to'>
            <Input value={form.settings.missionFormUrl} onChange={v => setSetting('missionFormUrl', v)}
              placeholder="https://forms.gle/…" />
          </Field>
        </Section>

        {/* ── Branding & Images ── */}
        <Section title="Branding & Images">
          <p className="text-xs -mt-2 mb-2" style={{ color: 'var(--muted)' }}>
            Paste public image URLs (Supabase Storage, Cloudinary, etc.)
          </p>
          <Field label="Nav Logo URL" hint="Overrides the Zero1 logo in landing page navigation">
            <Input value={form.settings.navLogoUrl} onChange={v => setSetting('navLogoUrl', v)}
              placeholder="https://…/logo.png" />
          </Field>
          <Field label="Pass Logo URL" hint="Logo shown on the digital pass">
            <Input value={form.settings.logoUrl} onChange={v => setSetting('logoUrl', v)}
              placeholder="https://…/logo.png" />
          </Field>
          <Field label="Pass Background URL" hint="Background image for the digital pass">
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

        {/* ── Partnership ── */}
        <Section title="Partnership">
          <Field label="Partner Name" hint="Shown as text fallback if no logo URL is set (e.g. Roastery Coffee)">
            <Input value={form.settings.partnerName} onChange={v => setSetting('partnerName', v)}
              placeholder="Roastery Coffee" />
          </Field>
          <Field label="Partner Logo URL" hint="Overrides the text above — paste a URL to the partner's logo image">
            <Input value={form.settings.partnerLogoUrl} onChange={v => setSetting('partnerLogoUrl', v)}
              placeholder="https://…/partner-logo.png" />
          </Field>
        </Section>

        {/* ── Social & Contact ── */}
        <Section title="Social & Contact">
          <Field label="Instagram URL">
            <Input value={form.settings.instagramUrl} onChange={v => setSetting('instagramUrl', v)}
              placeholder="https://instagram.com/zero1byz" />
          </Field>
          <Field label="Email Address">
            <Input value={form.settings.emailAddress} onChange={v => setSetting('emailAddress', v)}
              placeholder="hello@zero1.in" />
          </Field>
        </Section>

        {/* ── Donation ── */}
        <Section title="Donation">
          <Field label="Donation text" hint="Body copy in the Donation section">
            <Textarea value={form.settings.donationText} onChange={v => setSetting('donationText', v)}
              placeholder="All earnings after covering event costs are donated to charity…" rows={3} />
          </Field>
          <Field label="Donation photo — large (left)" hint="466 × 358 px">
            <Input value={form.settings.donationImage1Url} onChange={v => setSetting('donationImage1Url', v)}
              placeholder="https://…/photo1.jpg" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Donation photo — top right" hint="338 × 169 px">
              <Input value={form.settings.donationImage2Url} onChange={v => setSetting('donationImage2Url', v)}
                placeholder="https://…/photo2.jpg" />
            </Field>
            <Field label="Donation photo — bottom right" hint="338 × 169 px">
              <Input value={form.settings.donationImage3Url} onChange={v => setSetting('donationImage3Url', v)}
                placeholder="https://…/photo3.jpg" />
            </Field>
          </div>
        </Section>

        {/* ── Plus One ── */}
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

        {/* ── Activities ── */}
        <Section title="Activities (Skills you'll learn)">
          <p className="text-xs -mt-2 mb-2" style={{ color: 'var(--muted)' }}>
            Each activity card in the &quot;Skills you&apos;ll learn&quot; section. Use <code>\n</code> in title for line breaks, <code>**text**</code> in description for bold.
          </p>
          <div className="flex flex-col gap-4">
            {form.settings.activities.map((row, i) => (
              <div key={i} className="rounded-lg p-4 flex flex-col gap-3"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Activity {i + 1}</span>
                  {form.settings.activities.length > 1 && (
                    <button type="button"
                      onClick={() => setSetting('activities', form.settings.activities.filter((_, j) => j !== i))}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)' }}>
                      Remove
                    </button>
                  )}
                </div>
                <Field label="Icon URL" hint="Leave blank to use default icon for this position">
                  <Input value={row.icon}
                    onChange={v => setSetting('activities', form.settings.activities.map((r, j) => j === i ? { ...r, icon: v } : r))}
                    placeholder="https://…/icon.png" />
                </Field>
                <Field label="Title" hint="Use \n for line breaks">
                  <Input value={row.title}
                    onChange={v => setSetting('activities', form.settings.activities.map((r, j) => j === i ? { ...r, title: v } : r))}
                    placeholder="Risk Analysis" />
                </Field>
                <Field label="Description" hint="Use **text** for bold">
                  <Textarea value={row.description}
                    onChange={v => setSetting('activities', form.settings.activities.map((r, j) => j === i ? { ...r, description: v } : r))}
                    placeholder="Describe this activity…" rows={3} />
                </Field>
              </div>
            ))}
          </div>
          <button type="button"
            onClick={() => setSetting('activities', [...form.settings.activities, BLANK_ACTIVITY_ROW])}
            className="mt-2 text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: 'rgba(242,186,48,0.12)', color: 'var(--accent)', border: '1px solid rgba(242,186,48,0.25)' }}>
            + Add activity
          </button>
        </Section>

        {/* ── Timeline ── */}
        <Section title="Timeline / Schedule">
          <p className="text-xs -mt-2 mb-2" style={{ color: 'var(--muted)' }}>
            Each slot becomes a card in the timeline section of the landing page.
          </p>
          <div className="flex flex-col gap-4">
            {form.settings.timeline.map((row, i) => (
              <div key={i} className="rounded-lg p-4 flex flex-col gap-3"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Slot {i + 1}</span>
                  {form.settings.timeline.length > 1 && (
                    <button type="button"
                      onClick={() => setSetting('timeline', form.settings.timeline.filter((_, j) => j !== i))}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)' }}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Time" hint="e.g. 11 AM – 11:30 AM">
                    <Input value={row.time}
                      onChange={v => setSetting('timeline', form.settings.timeline.map((r, j) => j === i ? { ...r, time: v } : r))}
                      placeholder="11 AM – 11:30 AM" />
                  </Field>
                  <Field label="Activity Name">
                    <Input value={row.title}
                      onChange={v => setSetting('timeline', form.settings.timeline.map((r, j) => j === i ? { ...r, title: v } : r))}
                      placeholder="Money Charades" />
                  </Field>
                </div>
                <Field label="Description">
                  <Input value={row.description}
                    onChange={v => setSetting('timeline', form.settings.timeline.map((r, j) => j === i ? { ...r, description: v } : r))}
                    placeholder="What happens in this session…" />
                </Field>
                <Field label="Card Image URL" hint="290 × 243 px — landscape photo for the card background">
                  <Input value={row.imageUrl}
                    onChange={v => setSetting('timeline', form.settings.timeline.map((r, j) => j === i ? { ...r, imageUrl: v } : r))}
                    placeholder="https://…/activity.jpg" />
                </Field>
              </div>
            ))}
          </div>
          <button type="button"
            onClick={() => setSetting('timeline', [...form.settings.timeline, BLANK_TIMELINE_ROW])}
            className="mt-2 text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: 'rgba(242,186,48,0.12)', color: 'var(--accent)', border: '1px solid rgba(242,186,48,0.25)' }}>
            + Add slot
          </button>
        </Section>

        {/* ── Things to Know ── */}
        <Section title="Things to Know">
          <p className="text-xs -mt-2 mb-2" style={{ color: 'var(--muted)' }}>
            Each item is a bullet point. Icon URL is optional — leave blank to cycle through default pen icons. Use <code>**text**</code> for bold.
          </p>
          <div className="flex flex-col gap-4">
            {form.settings.thingsToKnow.map((row, i) => (
              <div key={i} className="rounded-lg p-4 flex flex-col gap-3"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Item {i + 1}</span>
                  {form.settings.thingsToKnow.length > 1 && (
                    <button type="button"
                      onClick={() => setSetting('thingsToKnow', form.settings.thingsToKnow.filter((_, j) => j !== i))}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)' }}>
                      Remove
                    </button>
                  )}
                </div>
                <Field label="Description">
                  <Input value={row.text}
                    onChange={v => setSetting('thingsToKnow', form.settings.thingsToKnow.map((r, j) => j === i ? { ...r, text: v } : r))}
                    placeholder="Tickets are non-transferable" />
                </Field>
                <Field label="Icon URL" hint="Leave blank to use default pen icon">
                  <Input value={row.iconUrl}
                    onChange={v => setSetting('thingsToKnow', form.settings.thingsToKnow.map((r, j) => j === i ? { ...r, iconUrl: v } : r))}
                    placeholder="https://…/icon.png" />
                </Field>
              </div>
            ))}
          </div>
          <button type="button"
            onClick={() => setSetting('thingsToKnow', [...form.settings.thingsToKnow, BLANK_KNOW_ROW])}
            className="mt-2 text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: 'rgba(242,186,48,0.12)', color: 'var(--accent)', border: '1px solid rgba(242,186,48,0.25)' }}>
            + Add item
          </button>
        </Section>

        {/* ── Selection Process ── */}
        <Section title="Selection Process">
          <p className="text-xs -mt-2 mb-2" style={{ color: 'var(--muted)' }}>
            Steps shown in the selection process section. Use <code>**text**</code> in description for bold.
          </p>
          <div className="flex flex-col gap-4">
            {form.settings.selectionProcess.map((step, i) => (
              <div key={i} className="rounded-lg p-4 flex flex-col gap-3"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Step {i + 1}</span>
                  {form.settings.selectionProcess.length > 1 && (
                    <button type="button"
                      onClick={() => setSetting('selectionProcess', form.settings.selectionProcess.filter((_, j) => j !== i))}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)' }}>
                      Remove
                    </button>
                  )}
                </div>
                <Field label="Icon URL">
                  <Input value={step.icon}
                    onChange={v => setSetting('selectionProcess', form.settings.selectionProcess.map((r, j) => j === i ? { ...r, icon: v } : r))}
                    placeholder="https://…/icon.png" />
                </Field>
                <Field label="Icon Size (px)" hint="Usually 32 or 38">
                  <Input type="number" value={step.iconSize}
                    onChange={v => setSetting('selectionProcess', form.settings.selectionProcess.map((r, j) => j === i ? { ...r, iconSize: v } : r))}
                    placeholder="32" />
                </Field>
                <Field label="Title">
                  <Input value={step.title}
                    onChange={v => setSetting('selectionProcess', form.settings.selectionProcess.map((r, j) => j === i ? { ...r, title: v } : r))}
                    placeholder="Mission Submission" />
                </Field>
                <Field label="Description">
                  <Textarea value={step.body}
                    onChange={v => setSetting('selectionProcess', form.settings.selectionProcess.map((r, j) => j === i ? { ...r, body: v } : r))}
                    placeholder="Describe this step…" rows={3} />
                </Field>
              </div>
            ))}
          </div>
          <button type="button"
            onClick={() => setSetting('selectionProcess', [...form.settings.selectionProcess, BLANK_STEP_ROW])}
            className="mt-2 text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: 'rgba(242,186,48,0.12)', color: 'var(--accent)', border: '1px solid rgba(242,186,48,0.25)' }}>
            + Add step
          </button>
        </Section>

        {/* ── WhatsApp Templates ── */}
        <Section title="WhatsApp Templates (Gupshup IDs)">
          <Field label="Selected Template ID" hint="Params: {{name}}, {{passUrl}}">
            <Input value={form.settings.whatsappTemplateSelected}
              onChange={v => setSetting('whatsappTemplateSelected', v)}
              placeholder="template-id-from-gupshup" />
          </Field>
          <Field label="Reminder Template ID" hint="Params: {{name}}, {{date}}, {{venue}}">
            <Input value={form.settings.whatsappTemplateReminder}
              onChange={v => setSetting('whatsappTemplateReminder', v)}
              placeholder="template-id-from-gupshup" />
          </Field>
          <Field label="+1 Invite Template ID" hint="Params: {{plusOneName}}, {{primaryName}}, {{passUrl}}">
            <Input value={form.settings.whatsappTemplatePlusOne}
              onChange={v => setSetting('whatsappTemplatePlusOne', v)}
              placeholder="template-id-from-gupshup" />
          </Field>
        </Section>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-3 rounded-lg text-black font-semibold text-sm disabled:opacity-50"
            style={{ background: 'var(--accent)' }}>
            {saving ? 'Saving…' : (noEvent ? 'Create Event' : 'Save Settings')}
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

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode
}) {
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
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} required={required}
      className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 transition"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        '--tw-ring-color': 'var(--accent)',
      } as React.CSSProperties} />
  )
}

function Textarea({
  value, onChange, placeholder, rows = 4,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 transition resize-y"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        '--tw-ring-color': 'var(--accent)',
      } as React.CSSProperties} />
  )
}
