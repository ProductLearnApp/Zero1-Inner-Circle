import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateQRPayload } from '@/lib/qr'
import { notifySelected } from '@/lib/whatsapp'
import { AttendeeStatus } from '@prisma/client'

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const attendee = await prisma.attendee.findUnique({
      where: { id: params.id },
      include: { event: { include: { settings: true } } },
    })
    if (!attendee) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ attendee })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json()
    const { status, seatLabel, manualCheckin, regenerateQR } = body as {
      status?: AttendeeStatus
      seatLabel?: string
      manualCheckin?: boolean
      regenerateQR?: boolean
    }

    const attendee = await prisma.attendee.findUnique({
      where: { id: params.id },
      include: { event: { include: { settings: true } } },
    })
    if (!attendee) return Response.json({ error: 'Not found' }, { status: 404 })

    const updateData: Record<string, unknown> = {}

    if (seatLabel !== undefined) updateData.seatLabel = seatLabel

    // Manual check-in (bypass QR scan)
    if (manualCheckin) {
      updateData.checkedIn = true
      updateData.checkedInAt = new Date()
      updateData.status = AttendeeStatus.CHECKED_IN
    }

    // Regenerate QR payload using the current QR_SECRET
    if (regenerateQR) {
      const seat = (seatLabel ?? attendee.seatLabel) ?? ''
      updateData.qrPayload = generateQRPayload({
        attendeeId: attendee.id,
        eventId: attendee.eventId,
        passType: 'primary',
        name: attendee.name,
        seatLabel: seat,
      })
      updateData.passUrl = `/pass/${attendee.id}`
      if (attendee.plusOneName && attendee.plusOnePhone) {
        updateData.plusOneQrPayload = generateQRPayload({
          attendeeId: attendee.id,
          eventId: attendee.eventId,
          passType: 'plusone',
          name: attendee.plusOneName,
          seatLabel: seat,
        })
      }
    }

    if (status && status !== attendee.status) {
      updateData.status = status

      // Generate QR when transitioning to SELECTED
      if (status === AttendeeStatus.SELECTED && !attendee.qrPayload) {
        const qrPayload = generateQRPayload({
          attendeeId: attendee.id,
          eventId: attendee.eventId,
          passType: 'primary',
          name: attendee.name,
          seatLabel: (seatLabel ?? attendee.seatLabel) ?? '',
        })
        updateData.qrPayload = qrPayload
        updateData.passUrl = `/pass/${attendee.id}`

        // Auto-send WhatsApp if template is configured
        const templateId = attendee.event.settings?.whatsappTemplateSelected
        if (templateId) {
          const passUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/pass/${attendee.id}`
          try {
            await notifySelected(attendee.phone, attendee.name, passUrl, templateId)
            updateData.notifiedAt = new Date()
          } catch (e) {
            console.error('WhatsApp send failed (non-fatal):', e)
          }
        }
      }
    }

    const updated = await prisma.attendee.update({
      where: { id: params.id },
      data: updateData,
    })

    return Response.json({ attendee: updated })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await prisma.attendee.delete({ where: { id: params.id } })
    return Response.json({ ok: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
