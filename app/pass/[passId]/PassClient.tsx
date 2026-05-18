'use client'

import Image from 'next/image'
import { PASS_ASSETS } from '@/lib/passAssets'
import { resolveMediaUrl } from '@/lib/basePath'
import { usePassFlow } from '@/hooks/usePassFlow'
import { TicketCard } from '@/components/pass/TicketCard/TicketCard'
import { EventMetaRow } from '@/components/pass/EventMetaRow/EventMetaRow'
import { MapsPreview } from '@/components/pass/MapsPreview/MapsPreview'
import { PromptBlock } from '@/components/pass/PromptBlock/PromptBlock'
import { PlusOneFormV2 } from '@/components/pass/PlusOneFormV2/PlusOneFormV2'
import { ConfirmedBlock } from '@/components/pass/ConfirmedBlock/ConfirmedBlock'
import { PointsToRemember } from '@/components/pass/PointsToRemember/PointsToRemember'
import type { QRConfig } from '@/types/pass'
import styles from './page.module.css'

type EventSettings = {
  accentColor: string
  allowPlusOne: boolean
  logoUrl: string | null
  passBackgroundUrl: string | null
  mapsUrl: string | null
  mapImageUrl: string | null
  passPointsToRemember: string[] | null
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
  const event = attendee.event
  const settings = event.settings
  const isSelected = attendee.status === 'SELECTED' || attendee.status === 'CHECKED_IN'

  const { state, plusOneData, isSubmitting, submitError, goToForm, submitForm } = usePassFlow(
    attendee.id,
    attendee.plusOneName,
    attendee.plusOneQrPayload
  )

  if (!isSelected) {
    return (
      <main className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ maxWidth: 320, textAlign: 'center', padding: 32, borderRadius: 16, background: 'var(--color-surface)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>Application Under Review</h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
            You&apos;re on the waitlist for {event.name}. We&apos;ll notify you via WhatsApp once you&apos;re selected.
          </p>
        </div>
      </main>
    )
  }

  const primaryQR: QRConfig = {
    value: attendee.qrPayload ?? attendee.id,
    fgColor: '#000000',
    bgColor: '#ffffff',
    level: 'M',
    logoUrl: resolveMediaUrl(settings?.logoUrl) ?? undefined,
  }

  const resolvedPlusOnePayload = state === 'confirmed' && plusOneData
    ? plusOneData.plusOnePassValue
    : null

  type Pass = { qrConfig: QRConfig; label: string }
  const passes: [Pass, Pass?] = resolvedPlusOnePayload
    ? [
        { qrConfig: primaryQR, label: 'Your pass' },
        {
          qrConfig: {
            value: resolvedPlusOnePayload,
            fgColor: '#000000',
            bgColor: '#ffffff',
            level: 'M',
            logoUrl: resolveMediaUrl(settings?.logoUrl) ?? undefined,
          },
          label: `${plusOneData!.plusOneName}'s pass`,
        },
      ]
    : [{ qrConfig: primaryQR, label: 'Your pass' }]

  const heroImageUrl = resolveMediaUrl(event.heroImageUrl) ?? PASS_ASSETS.heroBg
  const location = [event.city, event.venue].filter(Boolean).join(', ')
  const showPlusOneFlow = settings?.allowPlusOne && state !== 'confirmed'
  const mapsHref = settings?.mapsUrl
    ?? (location ? `https://maps.google.com/?q=${encodeURIComponent(location)}` : undefined)

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="Event hero">
        <div className={styles.heroBg}>
          <Image
            src={heroImageUrl}
            alt={event.name}
            fill
            className={styles.heroBgImg}
            priority
            unoptimized
          />
          <div className={styles.heroBgTint} aria-hidden="true" />
        </div>
        <div className={styles.heroGradient} aria-hidden="true" />
      </section>

      <div className={styles.ticketWrapper}>
        <TicketCard
          passes={passes}
          showPager={state === 'confirmed' && passes.length === 2}
          confirmed={state === 'confirmed'}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.metaSection}>
          <EventMetaRow date={event.date} time={event.time} location={location} />
          <MapsPreview
            mapImageUrl={resolveMediaUrl(settings?.mapImageUrl) ?? undefined}
            href={mapsHref}
          />
        </div>

        <div className={styles.stateBlock}>
          {showPlusOneFlow && state === 'initial' && (
            <PromptBlock onGenerate={goToForm} />
          )}
          {showPlusOneFlow && state === 'form' && (
            <PlusOneFormV2
              onSubmit={submitForm}
              isLoading={isSubmitting}
              error={submitError}
            />
          )}
          {state === 'confirmed' && plusOneData && (
            <ConfirmedBlock plusOneName={plusOneData.plusOneName} />
          )}
        </div>

        <PointsToRemember points={settings?.passPointsToRemember ?? undefined} />
      </div>

      <div className={styles.homeIndicator} aria-hidden="true">
        <div className={styles.homeBar} />
      </div>
    </main>
  )
}
