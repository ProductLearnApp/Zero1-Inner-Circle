import type { LandingEvent } from './types'
import { LandingNav } from './LandingNav'
import { HeroSection } from './HeroSection'
import { UpcomingEvents } from './UpcomingEvents'
import { AboutSection } from './AboutSection'
import { ShowMoreWrapper } from './ShowMoreWrapper'
import { ActivitiesGrid } from './ActivitiesGrid'
import { TimelineSection } from './TimelineSection'
import { SelectionCriteria } from './SelectionCriteria'
import { ThingsToKnow } from './ThingsToKnow'
import { DonationSection } from './DonationSection'
import { LandingFooter } from './LandingFooter'
import { MissionBar } from './MissionBar'

/*
 * Desktop layout — centered, 1440px canvas.
 *
 * Section widths from Figma 6055:4051:
 *   Nav: 1044px (sticky, 26px from top)
 *   Hero: full bleed
 *   Upcoming Events card: 820px
 *   About: 820px
 *   Skills: 820px
 *   Flow of the Event (timeline): 760px
 *   Selection Process: 841px
 *   Things to Know: 841px
 *   Donation: 841px
 *   Footer: full width
 *
 * Vertical spacing (from Figma y-positions):
 *   Hero → Upcoming Events: paddingTop 80px on Upcoming
 *   Upcoming Events → About: paddingTop 80px on About
 *   Each expanded section: paddingTop 100px
 */
export function LandingPage({ event }: { event: LandingEvent }) {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'Satoshi, sans-serif', background: '#0f071a' }}>

      {/* Sticky desktop nav */}
      <LandingNav event={event} />

      {/* Hero — full bleed */}
      <HeroSection event={event} />

      {/* ══════════════════ MOBILE LAYOUT ══════════════════ */}
      <div className="md:hidden w-full" style={{ maxWidth: 430, margin: '0 auto' }}>

        {/* Upcoming event card */}
        <UpcomingEvents event={event} />

        {/* About intro */}
        <div className="px-4" style={{ paddingTop: 48 }}>
          <AboutSection event={event} />
        </div>

        {/* Show more toggle + expanded content */}
        <ShowMoreWrapper>
          <div className="flex flex-col">
            <ActivitiesGrid event={event} />
            <TimelineSection event={event} />
            <div className="px-4">
              <SelectionCriteria event={event} />
            </div>
            <div style={{ height: 60 }} />
            <div className="px-4">
              <ThingsToKnow event={event} />
            </div>
            <DonationSection event={event} />
          </div>
        </ShowMoreWrapper>

      </div>

      {/* ══════════════════ DESKTOP LAYOUT ══════════════════ */}
      <div className="hidden md:flex flex-col items-center w-full">

        {/* Upcoming Events — 820px card */}
        <UpcomingEvents event={event} />

        {/* About the event — 820px wide, centered */}
        <div style={{ width: 820, paddingTop: 80 }}>
          <AboutSection event={event} />
        </div>

        {/* Show more / Show less + expanded sections */}
        <ShowMoreWrapper>
          <div className="flex flex-col items-center w-full">

            {/* Skills you'll learn — up to 820px */}
            <div style={{ width: '100%', paddingTop: 80 }}>
              <ActivitiesGrid event={event} />
            </div>

            {/* Flow of the Event — 760px */}
            <TimelineSection event={event} />

            {/* Selection Process — 841px */}
            <div className="flex flex-col items-center" style={{ paddingTop: 100, width: 841 }}>
              <SelectionCriteria event={event} />
            </div>

            {/* Things to Know — 841px */}
            <div className="flex flex-col items-center" style={{ paddingTop: 100, width: 841 }}>
              <ThingsToKnow event={event} />
            </div>

            {/* Donation */}
            <DonationSection event={event} />

          </div>
        </ShowMoreWrapper>

        <div style={{ height: 80 }} />
      </div>

      {/* Footer — always visible */}
      <LandingFooter event={event} />

      {/* Mobile sticky CTA bar */}
      <MissionBar event={event} />
      <div className="md:hidden" style={{ height: 104 }} />
    </div>
  )
}
