'use client'

import { useEffect, useState } from 'react'

type ActivityItem = { title: string; description: string; icon: string }
type TimelineItem = { time: string; title: string; description: string; imageUrl: string }

type MeetupForm = {
  eventId: string
  heroImageUrl: string
  heroSubtitle: string
  date: string
  time: string
  city: string
  venue: string
  price: string
  maxCapacity: number
  missionFormUrl: string
  sessionDescription: string
  aboutText: string
  eventAbout: string
  eventCardImageUrl: string
  eventCardSubtitle: string
  instagramUrl: string
  emailAddress: string
  partnerLogoUrl: string
  donationText: string
  donationImage1Url: string
  donationImage2Url: string
  donationImage3Url: string
  activities: ActivityItem[]
  timeline: TimelineItem[]
  thingsToKnow: string
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  { title: 'Risk Analysis', description: 'Analyse the difference between perceived risk and actual portfolio risk through evidence-based financial reasoning', icon: 'stack' },
  { title: 'Structural Risks', description: 'Investigate real investing mistakes using frameworks used in portfolio analysis, risk assessment, and behavioural finance', icon: 'money' },
  { title: 'Investor Psychology', description: 'Identify how investor behaviour changes under uncertainty, volatility, social influence, and performance pressure', icon: 'brain' },
  { title: 'Portfolio Diagnostics', description: 'Evaluate portfolios beyond returns by analysing diversification quality, concentration exposure, correlation between holdings, and other hidden structural weaknesses', icon: 'stack' },
  { title: 'Stress Testing', description: 'Recognise how portfolio construction, liquidity planning, and investment decision-making interact during financial stress situations', icon: 'stack' },
]

const DEFAULT_TIMELINE: TimelineItem[] = [
  { time: '11 AM – 11:30 AM',    title: 'Money Charades',                             description: 'The classic icebreaker, but with a money twist to it',                                                                       imageUrl: '' },
  { time: '11:30 AM – 12:30 PM', title: 'The Curious Case of a Dead Portfolio',       description: 'A case file, witness statements and evidence, we have it all. Now, it is on you to solve this money mystery',               imageUrl: '' },
  { time: '12:45 PM – 1:00 PM',  title: 'Networking and Experience Zones',            description: 'Some time for you to get to know your Inner Circle buddies better',                                                          imageUrl: '' },
  { time: '1:00 PM – 2:00 PM',   title: 'Balance(d) Sheet',                           description: "5 personalities, many money decisions - Who's doing money right? You decide",                                              imageUrl: '' },
  { time: '2:00 PM – 3:00 PM',   title: 'Lunch',                                      description: 'With an exclusive Zero1 Inner Circle menu to choose from',                                                                  imageUrl: '' },
]

const DEFAULT_THINGS_TO_KNOW = [
  'There are only 15 tickets available for this event',
  'Tickets are non-transferable. Entry will be denied if the names of the participant and +1 do not match the ticket',
  'Tickets are priced ₹3,000 + GST. Each ticket includes the entry of the participant, the entry of a +1, and food and beverages for the duration of the event',
  'Both the participant and +1 must be over 18 years of age and must carry a Government Photo ID to the event for verification',
  'Sharp objects, prohibited substances, lighters, e-cigarettes, food items, etc. are prohibited',
  'For any medication you wish to carry, please bring a doctor-signed prescription',
  'Passes for Inner Circle events are non-cancellable and non-refundable',
].join('\n')

const DEFAULT_FORM: MeetupForm = {
  eventId: '',
  heroImageUrl: '',
  heroSubtitle: 'An offline community to solve REAL personal finance problems',
  date: '',
  time: '',
  city: '',
  venue: '',
  price: '₹3,000',
  maxCapacity: 30,
  missionFormUrl: '',
  sessionDescription: 'In this session, we will figure out what a well-diversified portfolio looks like and figure out the money mistakes most of us make along the way',
  aboutText: 'Quarterly meet-ups across up to 8 cities\nTopic-based events for focused learning\nCurated hands-on activities to build technical skills\nAll earnings after covering event costs are donated to charity',
  eventAbout: 'Starting your investing journey can feel intimidating, especially when there\'s no perfect rubric to follow. In this meet-up we will try to answer a few questions:',
  eventCardImageUrl: '',
  eventCardSubtitle: 'Curating the right mix of investments',
  instagramUrl: '',
  emailAddress: '',
  partnerLogoUrl: '',
  donationText: 'All earnings after covering event costs are donated to charity. Every ticket you buy contributes directly to causes supported by the Zero1 community.',
  donationImage1Url: '',
  donationImage2Url: '',
  donationImage3Url: '',
  activities: DEFAULT_ACTIVITIES,
  timeline: DEFAULT_TIMELINE,
  thingsToKnow: DEFAULT_THINGS_TO_KNOW,
}

export default function MeetupPage() {
  const [form, setForm]       = useState<MeetupForm>(DEFAULT_FORM)
  const [loading, setLoading] = useState(true)
  const [, setNoEvent] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/event')
        if (!res.ok) { setNoEvent(true); setLoading(false); return }
        const { event } = await res.json()
        if (!event) {
          setNoEvent(true)
        } else {
          const s = event.settings
          setForm({
            eventId:        event.id,
            heroImageUrl:   event.heroImageUrl  ?? '',
            heroSubtitle:   s?.heroSubtitle     ?? DEFAULT_FORM.heroSubtitle,
            date:           event.date          ?? '',
            time:           event.time          ?? '',
            city:           event.city          ?? '',
            venue:          event.venue         ?? '',
            price:          event.price         ?? '₹3,000',
            maxCapacity:    event.maxCapacity   ?? 30,
            missionFormUrl:     s?.missionFormUrl      ?? '',
            sessionDescription: s?.sessionDescription  ?? DEFAULT_FORM.sessionDescription,
            aboutText:          s?.aboutText           ?? DEFAULT_FORM.aboutText,
            eventAbout:         s?.eventAbout          ?? DEFAULT_FORM.eventAbout,
            eventCardImageUrl:  s?.eventCardImageUrl   ?? '',
            eventCardSubtitle:  s?.eventCardSubtitle   ?? DEFAULT_FORM.eventCardSubtitle,
            instagramUrl:   s?.instagramUrl     ?? '',
            emailAddress:   s?.emailAddress     ?? '',
            partnerLogoUrl: s?.partnerLogoUrl   ?? '',
            donationText:       s?.donationText        ?? DEFAULT_FORM.donationText,
            donationImage1Url:  s?.donationImage1Url   ?? '',
            donationImage2Url:  s?.donationImage2Url   ?? '',
            donationImage3Url:  s?.donationImage3Url   ?? '',
            activities:     Array.isArray(s?.activities) ? s.activities as ActivityItem[] : DEFAULT_ACTIVITIES,
            timeline:       Array.isArray(s?.timeline)   ? s.timeline   as TimelineItem[] : DEFAULT_TIMELINE,
            thingsToKnow:   Array.isArray(s?.thingsToKnow)
                              ? (s.thingsToKnow as string[]).join('\n')
                              : DEFAULT_THINGS_TO_KNOW,
          })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function setSetting(field: keyof MeetupForm, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)

    const settingsPayload = {
      missionFormUrl:     form.missionFormUrl     || undefined,
      sessionDescription: form.sessionDescription || undefined,
      aboutText:          form.aboutText          || undefined,
      heroSubtitle:       form.heroSubtitle       || undefined,
      eventAbout:         form.eventAbout         || undefined,
      eventCardImageUrl:  form.eventCardImageUrl  || undefined,
      eventCardSubtitle:  form.eventCardSubtitle  || undefined,
      instagramUrl:       form.instagramUrl       || undefined,
      emailAddress:       form.emailAddress       || undefined,
      partnerLogoUrl:     form.partnerLogoUrl     || undefined,
      donationText:       form.donationText       || undefined,
      donationImage1Url:  form.donationImage1Url  || undefined,
      donationImage2Url:  form.donationImage2Url  || undefined,
      donationImage3Url:  form.donationImage3Url  || undefined,
      activities:     form.activities,
      timeline:       form.timeline,
      thingsToKnow:   form.thingsToKnow
                        .split('\n')
                        .map(s => s.trim())
                        .filter(Boolean),
    }

    try {
      // If no event exists yet, create one with defaults then patch settings
      let eventId = form.eventId
      if (!eventId) {
        const createRes = await fetch('/api/admin/event', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:         'Zero1 Money Circle',
            date:         form.date        || 'June 2025',
            time:         form.time        || '11 AM – 3 PM',
            city:         form.city        || 'Mumbai',
            venue:        form.venue       || 'TBD',
            price:        form.price       || undefined,
            maxCapacity:  form.maxCapacity || 30,
            heroImageUrl: form.heroImageUrl || undefined,
            settings:     settingsPayload,
          }),
        })
        if (!createRes.ok) {
          // Event might already exist (409) — re-fetch id
          if (createRes.status === 409) {
            const check = await fetch('/api/admin/event')
            const { event } = await check.json()
            if (event?.id) {
              eventId = event.id
              setForm(f => ({ ...f, eventId: event.id }))
              setNoEvent(false)
            } else {
              setError('Could not create event. Try Settings page first.')
              return
            }
          } else {
            const body = await createRes.json().catch(() => ({}))
            setError(body.error ?? `Failed to create event (${createRes.status})`)
            return
          }
        } else {
          const { event } = await createRes.json()
          eventId = event.id
          setForm(f => ({ ...f, eventId: event.id }))
          setNoEvent(false)
          setSaved(true)
          return
        }
      }

      const res = await fetch('/api/admin/event', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:           eventId,
          heroImageUrl: form.heroImageUrl || undefined,
          date:         form.date         || undefined,
          time:         form.time         || undefined,
          city:         form.city         || undefined,
          venue:        form.venue        || undefined,
          price:        form.price        || undefined,
          maxCapacity:  form.maxCapacity  || undefined,
          settings:     settingsPayload,
        }),
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

  // noEvent is kept in state but we still render the form — saving will auto-create the event

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center h-16 mb-2">
        <h1 className="text-2xl font-bold text-white">Meetup</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
        Configure everything shown on the public landing page.
      </p>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Hero */}
        <Section title="Hero">
          <Field label="Hero Image URL" hint={<>Full-width background photo at the top. <Dim>1440 × 678 px</Dim> recommended.</>}>
            <Input value={form.heroImageUrl} onChange={v => setSetting('heroImageUrl', v)}
              placeholder="https://…/crowd-photo.jpg" />
          </Field>
          <Field label="Hero Subtitle" hint='Line shown beneath the wordmark, e.g. "An offline community to solve REAL personal finance problems"'>
            <Input value={form.heroSubtitle} onChange={v => setSetting('heroSubtitle', v)}
              placeholder="An offline community to solve REAL personal finance problems" />
          </Field>
          <Field label="Hero Bullet Points" hint="One bullet per line — shown as ◆ list below the subtitle in the hero section">
            <textarea
              value={form.aboutText}
              onChange={e => setSetting('aboutText', e.target.value)}
              rows={5}
              placeholder="Quarterly meet-ups across up to 8 cities&#10;Topic-based events for focused learning…"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 transition resize-y"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', ['--tw-ring-color' as string]: 'var(--accent)' }}
            />
          </Field>
        </Section>

        {/* Upcoming Events Card */}
        <Section title="Upcoming Events Card">
          <Field label="Card Image URL" hint={<>Background image for the event card. <Dim>820 × 457 px</Dim> recommended.</>}>
            <Input value={form.eventCardImageUrl} onChange={v => setSetting('eventCardImageUrl', v)}
              placeholder="/api/admin/media/…" />
          </Field>
          <Field label="Card Subtitle" hint='Short line below the event name, e.g. "Curating the right mix of investments"'>
            <Input value={form.eventCardSubtitle} onChange={v => setSetting('eventCardSubtitle', v)}
              placeholder="Curating the right mix of investments" />
          </Field>
        </Section>

        {/* About the Event */}
        <Section title="About the Event">
          <Field label="Intro paragraph" hint="Shown in the collapsed view, before the 'Show more' button">
            <textarea
              value={form.eventAbout}
              onChange={e => setSetting('eventAbout', e.target.value)}
              rows={3}
              placeholder="Starting your investing journey can feel intimidating…"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 transition resize-y"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', ['--tw-ring-color' as string]: 'var(--accent)' }}
            />
          </Field>
          <Field label="Mission Form URL" hint='The link the "Start your mission" button points to'>
            <Input value={form.missionFormUrl} onChange={v => setSetting('missionFormUrl', v)}
              placeholder="https://forms.gle/…" />
          </Field>
        </Section>

        {/* Donation */}
        <Section title="Donation">
          <Field label="Donation text" hint="Body copy in the Donation section">
            <textarea
              value={form.donationText}
              onChange={e => setSetting('donationText', e.target.value)}
              rows={3}
              placeholder="All earnings after covering event costs are donated to charity…"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 transition resize-y"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', ['--tw-ring-color' as string]: 'var(--accent)' }}
            />
          </Field>
          <Field label="Donation photo — large (left)" hint={<><Dim>466 × 358 px</Dim></>}>
            <Input value={form.donationImage1Url} onChange={v => setSetting('donationImage1Url', v)}
              placeholder="/api/admin/media/…" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Donation photo — top right" hint={<><Dim>338 × 169 px</Dim></>}>
              <Input value={form.donationImage2Url} onChange={v => setSetting('donationImage2Url', v)}
                placeholder="/api/admin/media/…" />
            </Field>
            <Field label="Donation photo — bottom right" hint={<><Dim>338 × 169 px</Dim></>}>
              <Input value={form.donationImage3Url} onChange={v => setSetting('donationImage3Url', v)}
                placeholder="/api/admin/media/…" />
            </Field>
          </div>
          <Field label="Partner Logo URL" hint={<>Logo shown in &quot;In partnership with&quot;. <Dim>~360 × 144 px</Dim> PNG with transparent bg.</>}>
            <Input value={form.partnerLogoUrl} onChange={v => setSetting('partnerLogoUrl', v)}
              placeholder="/api/admin/media/…" />
          </Field>
        </Section>

        {/* Event Details */}
        <Section title="Event Details">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" hint="e.g. May 24, 2025 or June 2025">
              <Input value={form.date} onChange={v => setSetting('date', v)}
                placeholder="May 24, 2025" />
            </Field>
            <Field label="Time" hint="e.g. 6:00 PM – 9:00 PM">
              <Input value={form.time} onChange={v => setSetting('time', v)}
                placeholder="6:00 PM – 9:00 PM" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" hint="Shown publicly on the landing page">
              <Input value={form.city} onChange={v => setSetting('city', v)}
                placeholder="Mumbai" />
            </Field>
            <Field label="Venue" hint="Exact venue (shared privately after payment)">
              <Input value={form.venue} onChange={v => setSetting('venue', v)}
                placeholder="Bandra Kurla Complex" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price" hint='Shown as "X/- per head" on the page'>
              <Input value={form.price} onChange={v => setSetting('price', v)}
                placeholder="₹3,000" />
            </Field>
            <Field label="Total Passes" hint='Shown as "Only X passes"'>
              <input
                type="number"
                min={1}
                value={form.maxCapacity}
                onChange={e => setSetting('maxCapacity', Number(e.target.value))}
                placeholder="30"
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 transition"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  ['--tw-ring-color' as string]: 'var(--accent)',
                }}
              />
            </Field>
          </div>
        </Section>

        {/* Social & Contact */}
        <Section title="Social & Contact">
          <Field label="Instagram URL">
            <Input value={form.instagramUrl} onChange={v => setSetting('instagramUrl', v)}
              placeholder="https://instagram.com/zero1byz" />
          </Field>
          <Field label="Email Address">
            <Input value={form.emailAddress} onChange={v => setSetting('emailAddress', v)}
              placeholder="hello@zero1.in" />
          </Field>
        </Section>

        {/* Activities */}
        <Section title='Activities — "What you will get"'>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
            Activity cards shown on the landing page. Icon field: type <code>stack</code>, <code>brain</code>, or <code>money</code> — or paste a full image URL (<Dim>24 × 24 px</Dim>) from the Media library.
          </p>
          {form.activities.map((act, i) => (
            <div key={i} className="rounded-lg p-4 space-y-3 mb-3"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white">Activity {i + 1}</p>
                <button type="button"
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
                  onClick={() => setSetting('activities', form.activities.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <Field label="Title">
                    <Input value={act.title} onChange={v => {
                      const next = [...form.activities]; next[i] = { ...next[i], title: v }
                      setSetting('activities', next)
                    }} placeholder="Portfolio Foundations" />
                  </Field>
                </div>
                <Field label="Icon">
                  <Input value={act.icon} onChange={v => {
                    const next = [...form.activities]; next[i] = { ...next[i], icon: v }
                    setSetting('activities', next)
                  }} placeholder="stack" />
                </Field>
              </div>
              <Field label="Description">
                <Input value={act.description} onChange={v => {
                  const next = [...form.activities]; next[i] = { ...next[i], description: v }
                  setSetting('activities', next)
                }} placeholder="Short description…" />
              </Field>
            </div>
          ))}
          <button type="button"
            className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: 'rgba(242,186,48,0.1)', color: 'var(--accent)', border: '1px solid rgba(242,186,48,0.25)' }}
            onClick={() => setSetting('activities', [...form.activities, { title: '', description: '', icon: 'stack' }])}>
            + Add activity
          </button>
        </Section>

        {/* Timeline */}
        <Section title="Schedule / Timeline">
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
            Each slot becomes a card in the timeline section of the landing page.
          </p>
          {form.timeline.map((item, i) => (
            <div key={i} className="rounded-lg p-4 space-y-3 mb-3"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white">Slot {i + 1}</p>
                <button type="button"
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
                  onClick={() => setSetting('timeline', form.timeline.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Time">
                  <Input value={item.time} onChange={v => {
                    const next = [...form.timeline]; next[i] = { ...next[i], time: v }
                    setSetting('timeline', next)
                  }} placeholder="11 AM – 11:30 AM" />
                </Field>
                <Field label="Activity Name">
                  <Input value={item.title} onChange={v => {
                    const next = [...form.timeline]; next[i] = { ...next[i], title: v }
                    setSetting('timeline', next)
                  }} placeholder="Money Charades" />
                </Field>
              </div>
              <Field label="Description">
                <Input value={item.description ?? ''} onChange={v => {
                  const next = [...form.timeline]; next[i] = { ...next[i], description: v }
                  setSetting('timeline', next)
                }} placeholder="What happens in this session…" />
              </Field>
              <Field label="Card Image URL" hint={<><Dim>290 × 243 px</Dim> — landscape photo for the card background.</>}>
                <Input value={item.imageUrl} onChange={v => {
                  const next = [...form.timeline]; next[i] = { ...next[i], imageUrl: v }
                  setSetting('timeline', next)
                }} placeholder="https://…/activity.jpg" />
              </Field>
            </div>
          ))}
          <button type="button"
            className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: 'rgba(242,186,48,0.1)', color: 'var(--accent)', border: '1px solid rgba(242,186,48,0.25)' }}
            onClick={() => setSetting('timeline', [...form.timeline, { time: '', title: '', description: '', imageUrl: '' }])}>
            + Add slot
          </button>
        </Section>

        {/* Things to Know */}
        <Section title="Things to Know">
          <Field label="Bullet points" hint="One item per line — each line becomes a bullet on the landing page">
            <textarea
              value={form.thingsToKnow}
              onChange={e => setSetting('thingsToKnow', e.target.value)}
              rows={8}
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
            {saving ? 'Saving…' : 'Save Meetup Settings'}
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

function Dim({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold"
      style={{ background: 'rgba(242,186,48,0.12)', color: 'var(--accent)' }}>
      {children}
    </span>
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
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:ring-1 transition"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        '--tw-ring-color': 'var(--accent)',
      } as React.CSSProperties} />
  )
}
