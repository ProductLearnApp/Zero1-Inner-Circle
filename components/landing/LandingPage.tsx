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
 * Page layout — new design (Figma node 6079:4962).
 *
 * Collapsed state (default):
 *   Hero → Upcoming Events card → About intro → "Show more" button
 *
 * Expanded state (after "Show more" click):
 *   + Skills → Flow of the Event → Selection Process → Things to Know → Donation
 *
 * Footer always visible.
 */
export function LandingPage({ event }: { event: LandingEvent }) {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'Satoshi, sans-serif', background: '#0f071a' }}>

      {/* Sticky desktop nav */}
      <LandingNav event={event} />

      {/* Hero — full bleed */}
      <HeroSection event={event} />

      {/* ══════════════════ MOBILE LAYOUT ══════════════════ */}
      <div className="mx-auto w-full md:hidden" style={{ maxWidth: 430 }}>

        {/* Upcoming event card */}
        <UpcomingEvents event={event} />

        {/* About intro + Show more toggle */}
        <div className="px-4" style={{ paddingTop: 40 }}>
          <AboutSection event={event} />
          <ShowMoreWrapper>
            <ActivitiesGrid event={event} />
            <TimelineSection event={event} />
            <SelectionCriteria event={event} />
            <ThingsToKnow event={event} />
            <DonationSection event={event} />
          </ShowMoreWrapper>
        </div>

      </div>

      {/* ══════════════════ DESKTOP LAYOUT ══════════════════ */}
      <div className="hidden md:flex flex-col items-center">

        {/* Upcoming event card */}
        <UpcomingEvents event={event} />

        {/* About intro — centred, 841px wide */}
        <div className="flex flex-col items-center" style={{ paddingTop: 80, width: 841 }}>
          <AboutSection event={event} />
          <ShowMoreWrapper>
            <div className="flex flex-col items-center w-full">

              {/* Skills you'll learn */}
              <div className="flex flex-col items-center" style={{ marginTop: 80, width: 1000 }}>
                <ActivitiesGrid event={event} />
              </div>

              {/* Flow of the Event */}
              <div className="flex flex-col items-center" style={{ marginTop: 120 }}>
                <TimelineSection event={event} />
              </div>

              {/* Selection Process + Things to Know */}
              <div className="flex flex-col items-center" style={{ marginTop: 120, gap: 120 }}>
                <SelectionCriteria event={event} />
                <ThingsToKnow event={event} />
              </div>

              {/* Donation */}
              <DonationSection event={event} />

            </div>
          </ShowMoreWrapper>
        </div>

        <div style={{ height: 80 }} />
      </div>

      {/* Footer — always visible */}
      <LandingFooter event={event} />

      {/* Mobile sticky CTA */}
      <MissionBar event={event} />
      <div className="md:hidden" style={{ height: 104 }} />
    </div>
  )
}
