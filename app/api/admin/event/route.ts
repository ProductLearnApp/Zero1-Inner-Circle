import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    const event = id
      ? await prisma.event.findUnique({ where: { id }, include: { settings: true } })
      : await prisma.event.findFirst({
          orderBy: { createdAt: 'desc' },
          include: { settings: true },
        })

    // Stale Prisma module workaround: inject selectionProcess via raw SQL
    // (the in-memory module pre-dates this field and doesn't SELECT it)
    if (event?.settings) {
      const raw = await prisma.$queryRaw<Array<{ selectionProcess: unknown }>>`
        SELECT "selectionProcess" FROM "EventSettings" WHERE "eventId" = ${event.id}
      `
      if (raw[0] !== undefined) {
        ;(event.settings as Record<string, unknown>).selectionProcess = raw[0].selectionProcess
      }
    }

    // Return null (not 404) when no event exists — first-run is a normal state
    return Response.json({ event: event ?? null })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const existing = await prisma.event.findFirst()
    if (existing) {
      return Response.json({ error: 'Event already exists' }, { status: 409 })
    }

    const body = await req.json() as {
      name: string
      date: string
      time: string
      city: string
      venue: string
      price?: string
      heroImageUrl?: string
      maxCapacity?: number
      settings?: {
        accentColor?: string
        allowPlusOne?: boolean
        logoUrl?: string
        passBackgroundUrl?: string
        whatsappTemplateSelected?: string
        whatsappTemplateReminder?: string
        whatsappTemplatePlusOne?: string
        missionFormUrl?: string
        instagramUrl?: string
        emailAddress?: string
        aboutText?: string
        partnerLogoUrl?: string
        activities?: Prisma.InputJsonValue
        timeline?: Prisma.InputJsonValue
        thingsToKnow?: Prisma.InputJsonValue
      }
    }

    const { settings, ...eventFields } = body

    const event = await prisma.event.create({
      data: {
        ...eventFields,
        maxCapacity: eventFields.maxCapacity ?? 30,
        settings: {
          create: {
            accentColor: settings?.accentColor ?? '#F2BA30',
            allowPlusOne: settings?.allowPlusOne ?? true,
            logoUrl: settings?.logoUrl,
            passBackgroundUrl: settings?.passBackgroundUrl,
            whatsappTemplateSelected: settings?.whatsappTemplateSelected,
            whatsappTemplateReminder: settings?.whatsappTemplateReminder,
            whatsappTemplatePlusOne: settings?.whatsappTemplatePlusOne,
          },
        },
      },
      include: { settings: true },
    })

    return Response.json({ event }, { status: 201 })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as {
      id: string
      name?: string
      date?: string
      time?: string
      city?: string
      venue?: string
      price?: string
      heroImageUrl?: string
      maxCapacity?: number
      isActive?: boolean
      settings?: {
        logoUrl?: string
        passBackgroundUrl?: string
        accentColor?: string
        allowPlusOne?: boolean
        whatsappTemplateSelected?: string
        whatsappTemplateReminder?: string
        whatsappTemplatePlusOne?: string
        missionFormUrl?: string
        instagramUrl?: string
        emailAddress?: string
        aboutText?: string
        partnerLogoUrl?: string
        partnerName?: string
        navLogoUrl?: string
        activities?: Prisma.InputJsonValue
        timeline?: Prisma.InputJsonValue
        thingsToKnow?: Prisma.InputJsonValue
        selectionProcess?: Prisma.InputJsonValue
        mapsUrl?: string
        mapImageUrl?: string
        passPointsToRemember?: Prisma.InputJsonValue
        heroSubtitle?: string
        sessionDescription?: string
        eventAbout?: string
        eventCardImageUrl?: string
        eventCardSubtitle?: string
        donationText?: string
        donationImage1Url?: string
        donationImage2Url?: string
        donationImage3Url?: string
      }
    }

    const { id: rawId, settings, ...eventFields } = body
    let id = rawId
    if (!id) {
      const existing = await prisma.event.findFirst({ orderBy: { createdAt: 'desc' } })
      if (!existing) {
        const newEvent = await prisma.event.create({
          data: {
            name:         eventFields.name         ?? '',
            date:         eventFields.date         ?? '',
            time:         eventFields.time         ?? '',
            city:         eventFields.city         ?? '',
            venue:        eventFields.venue        ?? '',
            price:        eventFields.price        ?? '',
            heroImageUrl: eventFields.heroImageUrl ?? '',
            maxCapacity:  eventFields.maxCapacity  ?? 30,
            isActive:     eventFields.isActive     ?? false,
            settings: {
              create: {
                accentColor:              settings?.accentColor              ?? '#F2BA30',
                allowPlusOne:             settings?.allowPlusOne             ?? true,
                logoUrl:                  settings?.logoUrl,
                passBackgroundUrl:        settings?.passBackgroundUrl,
                whatsappTemplateSelected: settings?.whatsappTemplateSelected,
                whatsappTemplateReminder: settings?.whatsappTemplateReminder,
                whatsappTemplatePlusOne:  settings?.whatsappTemplatePlusOne,
              },
            },
          },
          include: { settings: true },
        })
        return Response.json({ event: newEvent }, { status: 201 })
      }
      id = existing.id
    }

    // Strip selectionProcess — the stale in-memory Prisma module (before dev-server restart)
    // rejects this field in the validator even though it exists in the schema.
    // It is written separately via $executeRaw which bypasses the JS-level validator.
    const { selectionProcess, ...settingsForPrisma } = settings ?? {}

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...eventFields,
        ...(Object.keys(settingsForPrisma).length > 0 || settings
          ? {
              settings: {
                upsert: {
                  create: {
                    accentColor:  settingsForPrisma.accentColor  ?? '#F2BA30',
                    allowPlusOne: settingsForPrisma.allowPlusOne ?? true,
                    logoUrl:                  settingsForPrisma.logoUrl,
                    passBackgroundUrl:        settingsForPrisma.passBackgroundUrl,
                    navLogoUrl:               settingsForPrisma.navLogoUrl,
                    partnerName:              settingsForPrisma.partnerName,
                    partnerLogoUrl:           settingsForPrisma.partnerLogoUrl,
                    whatsappTemplateSelected: settingsForPrisma.whatsappTemplateSelected,
                    whatsappTemplateReminder: settingsForPrisma.whatsappTemplateReminder,
                    whatsappTemplatePlusOne:  settingsForPrisma.whatsappTemplatePlusOne,
                    missionFormUrl:           settingsForPrisma.missionFormUrl,
                    instagramUrl:             settingsForPrisma.instagramUrl,
                    emailAddress:             settingsForPrisma.emailAddress,
                    aboutText:                settingsForPrisma.aboutText,
                    heroSubtitle:             settingsForPrisma.heroSubtitle,
                    sessionDescription:       settingsForPrisma.sessionDescription,
                    eventAbout:               settingsForPrisma.eventAbout,
                    eventCardImageUrl:        settingsForPrisma.eventCardImageUrl,
                    eventCardSubtitle:        settingsForPrisma.eventCardSubtitle,
                    donationText:             settingsForPrisma.donationText,
                    donationImage1Url:        settingsForPrisma.donationImage1Url,
                    donationImage2Url:        settingsForPrisma.donationImage2Url,
                    donationImage3Url:        settingsForPrisma.donationImage3Url,
                  },
                  update: settingsForPrisma,
                },
              },
            }
          : {}),
      },
      include: { settings: true },
    })

    // Write selectionProcess via raw SQL — bypasses the stale Prisma module validator
    if (selectionProcess !== undefined) {
      await prisma.$executeRaw`
        UPDATE "EventSettings"
        SET "selectionProcess" = ${JSON.stringify(selectionProcess)}::jsonb
        WHERE "eventId" = ${id}
      `
    }

    return Response.json({ event })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
