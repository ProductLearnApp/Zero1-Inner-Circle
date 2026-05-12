export type ActivityItem = {
  title: string
  description: string
  icon: string
}

export type TimelineItem = {
  time: string
  title: string
  imageUrl: string
}

export type EventSettings = {
  accentColor: string
  allowPlusOne: boolean
  logoUrl: string | null
  missionFormUrl: string | null
  instagramUrl: string | null
  emailAddress: string | null
  aboutText: string | null
  partnerLogoUrl: string | null
  activities: ActivityItem[] | null
  timeline: TimelineItem[] | null
  thingsToKnow: string[] | null
  sessionDescription: string | null
}

export type LandingEvent = {
  id: string
  name: string
  date: string
  time: string
  city: string
  venue: string
  price: string | null
  maxCapacity: number
  heroImageUrl: string | null
  settings: EventSettings | null
}
