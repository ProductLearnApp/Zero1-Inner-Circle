import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyQRPayload } from '@/lib/qr'
import { AttendeeStatus } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json() as { token: string }
    if (!token) return Response.json({ error: 'token required' }, { status: 400 })

    let payload
    try {
      payload = verifyQRPayload(token)
    } catch {
      return Response.json({ status: 'INVALID_QR', message: 'Tampered or fake QR' }, { status: 400 })
    }

    const attendee = await prisma.attendee.findUnique({
      where: { id: payload.attendeeId },
      include: { event: true },
    })

    if (!attendee) {
      return Response.json({ status: 'NOT_FOUND', message: 'Pass not found' }, { status: 404 })
    }

    if (attendee.eventId !== payload.eventId) {
      return Response.json({ status: 'WRONG_EVENT', message: 'Wrong event' }, { status: 400 })
    }

    if (
      attendee.status !== AttendeeStatus.SELECTED &&
      attendee.status !== AttendeeStatus.CHECKED_IN
    ) {
      const msg = attendee.status === AttendeeStatus.REJECTED
        ? 'This pass has been rejected'
        : 'Not on the list'
      return Response.json({ status: 'NOT_SELECTED', message: msg }, { status: 403 })
    }

    if (payload.passType === 'primary') {
      if (attendee.checkedIn) {
        return Response.json({
          status: 'ALREADY_CHECKED_IN',
          passType: 'primary',
          attendee: sanitize(attendee),
          checkedInAt: attendee.checkedInAt,
        })
      }

      const updated = await prisma.attendee.update({
        where: { id: attendee.id },
        data: {
          checkedIn: true,
          checkedInAt: new Date(),
          status: AttendeeStatus.CHECKED_IN,
        },
      })

      return Response.json({
        status: 'SUCCESS',
        passType: 'primary',
        attendee: sanitize(updated),
      })
    }

    if (payload.passType === 'plusone') {
      if (!attendee.plusOneName) {
        return Response.json({ status: 'NO_PLUS_ONE', message: 'No +1 registered' }, { status: 400 })
      }

      if (attendee.plusOneCheckedIn) {
        return Response.json({
          status: 'ALREADY_CHECKED_IN',
          passType: 'plusone',
          attendee: sanitize(attendee),
          checkedInAt: attendee.plusOneCheckedInAt,
        })
      }

      const updated = await prisma.attendee.update({
        where: { id: attendee.id },
        data: { plusOneCheckedIn: true, plusOneCheckedInAt: new Date() },
      })

      return Response.json({
        status: 'SUCCESS',
        passType: 'plusone',
        attendee: sanitize(updated),
      })
    }

    return Response.json({ status: 'INVALID_QR', message: 'Unknown pass type' }, { status: 400 })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

type AttendeeRow = {
  id: string; name: string; phone: string; status: AttendeeStatus
  seatLabel: string | null; checkedIn: boolean; checkedInAt: Date | null
  plusOneName: string | null; plusOnePhone: string | null
  plusOneCheckedIn: boolean; plusOneCheckedInAt: Date | null
}

function sanitize(a: AttendeeRow) {
  return {
    id: a.id,
    name: a.name,
    phone: a.phone,
    status: a.status,
    seatLabel: a.seatLabel,
    checkedIn: a.checkedIn,
    checkedInAt: a.checkedInAt,
    plusOneName: a.plusOneName,
    plusOnePhone: a.plusOnePhone,
    plusOneCheckedIn: a.plusOneCheckedIn,
    plusOneCheckedInAt: a.plusOneCheckedInAt,
  }
}
