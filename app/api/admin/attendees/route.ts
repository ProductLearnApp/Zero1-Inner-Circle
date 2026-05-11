import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
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
