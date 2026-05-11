import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateQRPayload } from '@/lib/qr'
import { normalizePhone } from '@/lib/phone'
import { notifyPlusOne } from '@/lib/whatsapp'
import { AttendeeStatus } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { attendeeId, plusOneName, plusOnePhone } = await req.json() as {
      attendeeId: string
      plusOneName: string
      plusOnePhone: string
    }

    if (!attendeeId || !plusOneName || !plusOnePhone) {
      return Response.json({ error: 'attendeeId, plusOneName and plusOnePhone required' }, { status: 400 })
    }

    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
      include: { event: { include: { settings: true } } },
    })

    if (!attendee) return Response.json({ error: 'Attendee not found' }, { status: 404 })

    if (
      attendee.status !== AttendeeStatus.SELECTED &&
      attendee.status !== AttendeeStatus.CHECKED_IN
    ) {
      return Response.json({ error: 'Attendee is not selected' }, { status: 403 })
    }

    if (!attendee.event.settings?.allowPlusOne) {
      return Response.json({ error: '+1 is not allowed for this event' }, { status: 403 })
    }

    if (attendee.plusOneName) {
      return Response.json({ error: '+1 already registered' }, { status: 409 })
    }

    const phone = normalizePhone(plusOnePhone)
    if (!phone) {
      return Response.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    const plusOneQrPayload = generateQRPayload({
      attendeeId: attendee.id,
      eventId: attendee.eventId,
      passType: 'plusone',
      name: plusOneName.trim(),
      seatLabel: attendee.seatLabel ?? '',
    })

    const updated = await prisma.attendee.update({
      where: { id: attendeeId },
      data: {
        plusOneName: plusOneName.trim(),
        plusOnePhone: phone,
        plusOneQrPayload,
      },
      include: { event: { include: { settings: true } } },
    })

    // Send WhatsApp to the +1 if template is configured
    const templateId = updated.event.settings?.whatsappTemplatePlusOne
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''
    const passUrl = `${baseUrl}/pass/${attendeeId}`

    if (templateId) {
      try {
        await notifyPlusOne(phone, plusOneName.trim(), attendee.name, passUrl, templateId)
      } catch (e) {
        console.error('WhatsApp +1 notification failed (non-fatal):', e)
      }
    }

    const { qrPayload: _, plusOneQrPayload: __, ...safeAttendee } = updated

    return Response.json({
      attendee: {
        ...safeAttendee,
        qrPayload: updated.qrPayload,
        plusOneQrPayload: updated.plusOneQrPayload,
      },
    })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
