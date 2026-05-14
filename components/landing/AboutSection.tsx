import type { LandingEvent } from './types'
import { SectionTitle } from './SectionTitle'

/*
 * "About the event" — the short intro paragraph shown in the collapsed view.
 * Configurable via event.settings.eventAbout.
 */

const DEFAULT_ABOUT =
  'Starting your investing journey can feel intimidating, especially when there\'s no perfect rubric to follow. In this meet-up we will try to answer a few questions:'

export function AboutSection({ event }: { event: LandingEvent }) {
  const text = event.settings?.eventAbout ?? DEFAULT_ABOUT

  return (
    <>
      {/* ── Mobile ── */}
      <div className="flex flex-col md:hidden" style={{ gap: 16 }}>
        <SectionTitle>About the event</SectionTitle>
        <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '22px', color: '#b7b5bb' }}>
          {text}
        </p>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col w-full" style={{ gap: 20 }}>
        <SectionTitle>About the event</SectionTitle>
        <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '26px', color: '#b7b5bb' }}>
          {text}
        </p>
      </div>
    </>
  )
}
