import type { LandingEvent } from './types'
import { LandingNav } from './LandingNav'
import { HeroSection } from './HeroSection'
import { EventDetails } from './EventDetails'
import { AboutSection } from './AboutSection'
import { ActivitiesGrid } from './ActivitiesGrid'
import { TimelineSection } from './TimelineSection'
import { SelectionCriteria } from './SelectionCriteria'
import { ThingsToKnow } from './ThingsToKnow'
import { LandingFooter } from './LandingFooter'
import { MissionBar } from './MissionBar'

/*
 * Page background: #0f071a (matches Figma desktop frame bg exactly).
 *
 * Mobile (< 768px):  narrow 360px layout, sticky bottom CTA bar
 * Desktop (≥ 768px): full 1440px layout, all content centred
 *
 * Desktop spacing (derived from Figma y-coordinates):
 *   Hero ends at 678px
 *   Money Mixology section starts at 748px → 70px gap after hero
 *   What you will get starts at 1368px → 620px from hero bottom
 *   Activities for you starts at 1891px
 *   Selection criteria / Things / Partner: gap-[120px] inside their container
 */
export function LandingPage({ event }: { event: LandingEvent }) {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'Satoshi, sans-serif', background: '#0f071a' }}>

      {/* Sticky desktop nav (hidden on mobile) */}
      <LandingNav event={event} />

      {/* Hero — full bleed, handles both sizes internally */}
      <HeroSection event={event} />

      {/* ══════════════════ MOBILE LAYOUT ══════════════════ */}
      <div className="mx-auto w-full md:hidden" style={{ maxWidth: 430 }}>

        {/* About + Money Mixology + Event Details block */}
        <div className="flex flex-col px-4" style={{ gap: 18, paddingTop: 0, paddingBottom: 61 }}>
          <AboutSection event={event} />
          <EventDetails event={event} />
        </div>

        {/* Sections below: gap-[76px] between list and timeline group, gap-[60px] inside */}
        <div className="flex flex-col" style={{ gap: 76 }}>
          <ActivitiesGrid event={event} />
          <div className="flex flex-col" style={{ gap: 60 }}>
            <TimelineSection event={event} />
            <SelectionCriteria event={event} />
            <ThingsToKnow event={event} />
          </div>
        </div>

      </div>

      {/* ══════════════════ DESKTOP LAYOUT ══════════════════ */}
      <div className="hidden md:flex flex-col items-center" style={{ paddingTop: 185 }}>

        {/* Money Mixology (1000px wide, gap-[36px] between about and event details) */}
        <div className="flex flex-col items-center" style={{ width: 1000, gap: 36 }}>
          <AboutSection event={event} />
          <EventDetails event={event} />
        </div>

        {/* Skills you'll learn — same 1000px container as above so section title lines up */}
        <div className="flex flex-col items-center" style={{ marginTop: 120, width: 1000 }}>
          <ActivitiesGrid event={event} />
        </div>

        {/* Activities for you staggered timeline (678px) */}
        <div className="flex flex-col items-center" style={{ marginTop: 120 }}>
          <TimelineSection event={event} />
        </div>

        {/* Selection / Things to know (gap-[120px]) */}
        <div className="flex flex-col items-center" style={{ marginTop: 120, gap: 120 }}>
          <SelectionCriteria event={event} />
          <ThingsToKnow event={event} />
        </div>

        <div style={{ height: 80 }} />
      </div>

      {/* Footer — full width, handles both */}
      <LandingFooter event={event} />

      {/* Mobile sticky CTA */}
      <MissionBar event={event} />
      <div className="md:hidden" style={{ height: 104 }} />
    </div>
  )
}
