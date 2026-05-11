import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { passId: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const attendee = await prisma.attendee.findUnique({
      where: { id: params.passId },
      include: {
        event: {
          include: { settings: true },
        },
      },
    })

    if (!attendee) {
      return Response.json({ error: 'Pass not found' }, { status: 404 })
    }

    // Strip server-only fields before returning to client
    const {
      qrPayload,
      plusOneQrPayload,
      ...safeAttendee
    } = attendee

    // Only expose QR payloads if attendee is SELECTED/CHECKED_IN
    const isSelected =
      attendee.status === 'SELECTED' || attendee.status === 'CHECKED_IN'

    return Response.json({
      attendee: {
        ...safeAttendee,
        ...(isSelected ? { qrPayload, plusOneQrPayload } : {}),
      },
    })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
