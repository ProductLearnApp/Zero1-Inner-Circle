import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizePhone } from '@/lib/phone'
import { generateQRPayload } from '@/lib/qr'
import { AttendeeStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const status = searchParams.get('status') as AttendeeStatus | null
    const search = searchParams.get('search') ?? ''
    const eventId = searchParams.get('eventId')

    const where = {
      ...(eventId ? { eventId } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    }

    const attendees = await prisma.attendee.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      include: { event: { select: { name: true } } },
    })

    return Response.json({ attendees })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { eventId, name, phone: rawPhone, status: rawStatus, seatLabel } = await req.json() as {
      eventId: string
      name: string
      phone: string
      status?: string
      seatLabel?: string
    }

    if (!eventId || !name || !rawPhone) {
      return Response.json({ error: 'eventId, name and phone are required' }, { status: 400 })
    }

    const phone = normalizePhone(rawPhone)
    if (!phone) {
      return Response.json({ error: `Invalid phone number "${rawPhone}". Use 10-digit or E.164 format.` }, { status: 400 })
    }

    const status: AttendeeStatus = (() => {
      const v = (rawStatus ?? '').toLowerCase().trim()
      if (v === 'selected') return AttendeeStatus.SELECTED
      if (v === 'rejected') return AttendeeStatus.REJECTED
      return AttendeeStatus.NOT_SELECTED
    })()

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) return Response.json({ error: 'Event not found' }, { status: 404 })

    try {
      const created = await prisma.attendee.create({
        data: { eventId, name: name.trim(), phone, status, seatLabel: seatLabel?.trim() || null },
      })

      if (status === AttendeeStatus.SELECTED) {
        const qrPayload = generateQRPayload({
          attendeeId: created.id,
          eventId,
          passType: 'primary',
          name: created.name,
          seatLabel: created.seatLabel ?? '',
        })
        const updated = await prisma.attendee.update({
          where: { id: created.id },
          data: { qrPayload, passUrl: `/pass/${created.id}` },
        })
        return Response.json({ attendee: updated }, { status: 201 })
      }

      return Response.json({ attendee: created }, { status: 201 })
    } catch (e: unknown) {
      if ((e as { code?: string }).code === 'P2002') {
        return Response.json({ error: 'An attendee with this phone already exists for this event' }, { status: 409 })
      }
      throw e
    }
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
