'use client'

import { useState } from 'react'
import QRCodeDisplay from '@/components/pass/QRCodeDisplay'
import PlusOneForm from '@/components/pass/PlusOneForm'

type EventSettings = {
  accentColor: string
  allowPlusOne: boolean
  logoUrl: string | null
  passBackgroundUrl: string | null
}

type Event = {
  id: string
  name: string
  date: string
  time: string
  city: string
  venue: string
  heroImageUrl: string | null
  settings: EventSettings | null
}

type Attendee = {
  id: string
  name: string
  phone: string
  status: string
  seatLabel: string | null
  qrPayload: string | null
  plusOneName: string | null
  plusOnePhone: string | null
  plusOneQrPayload: string | null
  checkedIn: boolean
  plusOneCheckedIn: boolean
  event: Event
}

export default function PassClient({ attendee }: { attendee: Attendee }) {
  const [current, setCurrent] = useState(attendee)
  const event = current.event
  const settings = event.settings
  const accent = settings?.accentColor ?? '#F2BA30'
  const isSelected = current.status === 'SELECTED' || current.status === 'CHECKED_IN'

  if (!isSelected) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#0A0A0F' }}>
        <div className="max-w-sm text-center p-8 rounded-2xl"
          style={{ background: '#161616', border: '1px solid #2a2a2a' }}>
          <div className="text-4xl mb-4">⏳</div>
          <h1 className="text-xl font-bold text-white mb-2">Application Under Review</h1>
          <p className="text-sm" style={{ color: '#888' }}>
            You&apos;re on the waitlist for {event.name}. We&apos;ll notify you via WhatsApp once you&apos;re selected.
          </p>
        </div>
      </main>
    )
  }

  const hasPlusOne = !!current.plusOneName

  return (
    <main className="min-h-screen py-8 px-4" style={{ background: '#0A0A0F' }}>
      <div className="max-w-sm mx-auto space-y-4">

        {/* Hero banner */}
        {event.heroImageUrl && (
          <div className="rounded-2xl overflow-hidden h-36 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.heroImageUrl} alt={event.name}
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-3 left-4 text-white font-bold text-lg">{event.name}</p>
          </div>
        )}

        {/* Primary ticket */}
        <TicketCard
          label="Your Pass"
          name={current.name}
          seatLabel={current.seatLabel}
          qrPayload={current.qrPayload}
          date={event.date}
          accent={accent}
          logoUrl={settings?.logoUrl}
          bgUrl={settings?.passBackgroundUrl}
          status={current.status}
        />

        {/* +1 ticket (if registered) */}
        {hasPlusOne && current.plusOneQrPayload && (
          <TicketCard
            label="+1 Guest Pass"
            name={current.plusOneName!}
            seatLabel={current.seatLabel}
            qrPayload={current.plusOneQrPayload}
            date={event.date}
            accent={accent}
            logoUrl={settings?.logoUrl}
            bgUrl={settings?.passBackgroundUrl}
            status="SELECTED"
          />
        )}

        {/* Event details */}
        <div className="rounded-2xl p-5 space-y-2"
          style={{ background: '#161616', border: '1px solid #2a2a2a' }}>
          <Detail icon="📅" text={`${event.date} · ${event.time}`} />
          <Detail icon="📍" text={`${event.city} · ${event.venue}`} />
        </div>

        {/* +1 invite section */}
        {settings?.allowPlusOne && !hasPlusOne && (
          <PlusOneForm attendeeId={current.id} accent={accent}
            onSuccess={updated => setCurrent(prev => ({ ...prev, ...updated }))} />
        )}

        {hasPlusOne && (
          <div className="rounded-2xl p-4 text-center"
            style={{ background: '#0f2a10', border: '1px solid #2a5a20' }}>
            <p className="text-sm text-green-400 font-medium">
              ✓ You are attending with {current.plusOneName}
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="rounded-2xl p-5"
          style={{ background: '#161616', border: '1px solid #2a2a2a' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#888' }}>POINTS TO REMEMBER</p>
          <ol className="space-y-2 text-sm" style={{ color: '#ccc' }}>
            <li>1. One pass = 2 people maximum</li>
            <li>2. Valid govt. ID may be required</li>
            <li>3. Pass will be verified at entrance</li>
          </ol>
        </div>
      </div>
    </main>
  )
}

function TicketCard({
  label, name, seatLabel, qrPayload, date, accent, logoUrl, bgUrl, status,
}: {
  label: string
  name: string
  seatLabel: string | null
  qrPayload: string | null
  date: string
  accent: string
  logoUrl: string | null | undefined
  bgUrl: string | null | undefined
  status: string
}) {
  const checkedIn = status === 'CHECKED_IN'

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: bgUrl ? `url(${bgUrl}) center/cover` : '#161616',
        border: '1px solid #2a2a2a',
      }}>
      <div style={{ background: bgUrl ? 'rgba(22,22,22,0.88)' : undefined }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="logo" className="h-8 object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-black text-xs font-bold"
                style={{ background: accent }}>Z</div>
              <span className="text-white text-sm font-semibold">Zero1</span>
            </div>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: checkedIn ? '#0f1f2a' : '#1a2a10', color: checkedIn ? '#30b0cf' : '#6fcf30' }}>
            {checkedIn ? 'Checked In' : 'Confirmed'}
          </span>
        </div>

        {/* QR */}
        <div className="flex flex-col items-center py-4 px-5">
          <p className="text-xs mb-3" style={{ color: '#888' }}>{label}</p>
          {qrPayload ? (
            <QRCodeDisplay payload={qrPayload} size={320} />
          ) : (
            <div className="w-[220px] h-[220px] rounded-xl bg-white/5 flex items-center justify-center">
              <p className="text-xs" style={{ color: '#555' }}>QR unavailable</p>
            </div>
          )}
        </div>

        {/* Perforated divider */}
        <div className="flex items-center px-3 my-1">
          <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: '#0A0A0F', marginLeft: '-8px' }} />
          <div className="flex-1 border-t border-dashed mx-1" style={{ borderColor: '#333' }} />
          <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: '#0A0A0F', marginRight: '-8px' }} />
        </div>

        {/* Attendee info */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-bold text-white text-base">{name}</p>
            <p className="text-xs mt-0.5" style={{ color: '#888' }}>{date}</p>
          </div>
          {seatLabel && (
            <div className="text-right">
              <p className="text-xs" style={{ color: '#888' }}>Seat</p>
              <p className="font-mono font-bold text-base" style={{ color: accent }}>{seatLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Detail({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3 text-sm" style={{ color: '#ccc' }}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  )
}
