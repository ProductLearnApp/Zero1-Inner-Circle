import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AttendeeStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const eventId = req.nextUrl.searchParams.get('eventId')
    if (!eventId) return Response.json({ error: 'eventId required' }, { status: 400 })

    const [total, selected, checkedIn, recentScans] = await Promise.all([
      prisma.attendee.count({ where: { eventId } }),
      prisma.attendee.count({ where: { eventId, status: { in: [AttendeeStatus.SELECTED, AttendeeStatus.CHECKED_IN] } } }),
      prisma.attendee.count({ where: { eventId, checkedIn: true } }),
      prisma.attendee.findMany({
        where: { eventId, checkedIn: true },
        orderBy: { checkedInAt: 'desc' },
        take: 20,
        select: {
          id: true,
          name: true,
          seatLabel: true,
          checkedInAt: true,
          plusOneName: true,
          plusOneCheckedIn: true,
          plusOneCheckedInAt: true,
        },
      }),
    ])

    // Count +1 check-ins separately
    const plusOneCheckedIn = await prisma.attendee.count({
      where: { eventId, plusOneCheckedIn: true },
    })

    return Response.json({
      total,
      selected,
      checkedIn,
      plusOneCheckedIn,
      totalPresent: checkedIn + plusOneCheckedIn,
      recentScans,
    })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
