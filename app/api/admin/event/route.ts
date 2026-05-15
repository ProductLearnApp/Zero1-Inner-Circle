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
        navLogoUrl?: string
        activities?: Prisma.InputJsonValue
        timeline?: Prisma.InputJsonValue
        thingsToKnow?: Prisma.InputJsonValue
        mapsUrl?: string
        mapImageUrl?: string
        passPointsToRemember?: Prisma.InputJsonValue
        heroSubtitle?: string
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
            ...eventFields,
            name: eventFields.name ?? '',
            maxCapacity: eventFields.maxCapacity ?? 30,
            settings: {
              create: {
                accentColor:  settings?.accentColor  ?? '#F2BA30',
                allowPlusOne: settings?.allowPlusOne ?? true,
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

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...eventFields,
        ...(settings
          ? {
              settings: {
                upsert: {
                  create: settings,
                  update: settings,
                },
              },
            }
          : {}),
      },
      include: { settings: true },
    })

    return Response.json({ event })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
