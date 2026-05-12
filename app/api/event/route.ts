import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const event = await prisma.event.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { settings: true },
    })

    if (!event) return Response.json({ event: null })

    const { settings, ...eventFields } = event

    return Response.json({
      event: {
        ...eventFields,
        settings: settings
          ? {
              accentColor: settings.accentColor,
              allowPlusOne: settings.allowPlusOne,
              logoUrl: settings.logoUrl,
              missionFormUrl: settings.missionFormUrl,
              instagramUrl: settings.instagramUrl,
              emailAddress: settings.emailAddress,
              aboutText: settings.aboutText,
              partnerLogoUrl: settings.partnerLogoUrl,
              activities: settings.activities,
              timeline: settings.timeline,
              thingsToKnow: settings.thingsToKnow,
            }
          : null,
      },
    })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
