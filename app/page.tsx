import { prisma } from '@/lib/prisma'
import { LandingPage } from '@/components/landing/LandingPage'
import type { LandingEvent } from '@/components/landing/types'

export const dynamic = 'force-dynamic'

async function getEvent(): Promise<LandingEvent | null> {
  try {
    const event = await prisma.event.findFirst({
      orderBy: { createdAt: 'desc' },
      where: { isActive: true },
      include: { settings: true },
    })
    if (!event) return null

    const s = event.settings
    return {
      id: event.id,
      name: event.name,
      date: event.date,
      time: event.time,
      city: event.city,
      venue: event.venue,
      price: event.price ?? null,
      maxCapacity: event.maxCapacity,
      heroImageUrl: event.heroImageUrl ?? null,
      settings: s
        ? {
            accentColor: s.accentColor,
            allowPlusOne: s.allowPlusOne,
            logoUrl: s.logoUrl ?? null,
            missionFormUrl: s.missionFormUrl ?? null,
            instagramUrl: s.instagramUrl ?? null,
            emailAddress: s.emailAddress ?? null,
            aboutText: s.aboutText ?? null,
            sessionDescription: s.sessionDescription ?? null,
            partnerLogoUrl: s.partnerLogoUrl ?? null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            activities: Array.isArray(s.activities) ? (s.activities as any[]) : null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            timeline: Array.isArray(s.timeline) ? (s.timeline as any[]) : null,
            thingsToKnow: Array.isArray(s.thingsToKnow) ? (s.thingsToKnow as string[]) : null,
            heroSubtitle: s.heroSubtitle ?? null,
            eventAbout: s.eventAbout ?? null,
            eventCardImageUrl: s.eventCardImageUrl ?? null,
            eventCardSubtitle: s.eventCardSubtitle ?? null,
            donationText: s.donationText ?? null,
            donationImage1Url: s.donationImage1Url ?? null,
            donationImage2Url: s.donationImage2Url ?? null,
            donationImage3Url: s.donationImage3Url ?? null,
          }
        : null,
    }
  } catch {
    return null
  }
}

const DEFAULT_EVENT: LandingEvent = {
  id: '',
  name: 'Zero1 Money Circle',
  date: 'June 2025',
  time: '11 AM – 3 PM',
  city: 'Mumbai',
  venue: 'TBD — sent 24 hrs before',
  price: '₹3,000',
  maxCapacity: 30,
  heroImageUrl: null,
  settings: null,
}

export default async function RootPage() {
  const event = await getEvent()
  return <LandingPage event={event ?? DEFAULT_EVENT} />
}
