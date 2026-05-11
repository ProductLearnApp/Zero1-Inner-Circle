import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    // Find by id, or fall back to most recent event regardless of isActive flag.
    // The isActive filter was too strict — a single admin toggling it off locked everyone out.
    const event = id
      ? await prisma.event.findUnique({ where: { id }, include: { settings: true } })
      : await prisma.event.findFirst({
          orderBy: { createdAt: 'desc' },
          include: { settings: true },
        })

    if (!event) return Response.json({ error: 'No event found' }, { status: 404 })
    return Response.json({ event })
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
      }
    }

    const { id, settings, ...eventFields } = body
    if (!id) return Response.json({ error: 'id required' }, { status: 400 })

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
