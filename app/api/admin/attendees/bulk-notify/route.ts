import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifySelected, notifyReminder } from '@/lib/whatsapp'
import { BASE_PATH } from '@/lib/basePath'
import { AttendeeStatus } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { eventId, type = 'selected', attendeeIds } = await req.json() as {
      eventId: string
      type?: 'selected' | 'reminder'
      attendeeIds?: string[]
    }

    if (!eventId) return Response.json({ error: 'eventId required' }, { status: 400 })

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { settings: true },
    })
    if (!event) return Response.json({ error: 'Event not found' }, { status: 404 })

    const settings = event.settings
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''

    const attendees = await prisma.attendee.findMany({
      where: {
        eventId,
        status: { in: [AttendeeStatus.SELECTED, AttendeeStatus.CHECKED_IN] },
        ...(attendeeIds?.length ? { id: { in: attendeeIds } } : {}),
      },
    })

    const results = { sent: 0, failed: 0, errors: [] as string[] }

    for (const a of attendees) {
      try {
        if (type === 'reminder') {
          const templateId = settings?.whatsappTemplateReminder
          if (!templateId) throw new Error('Reminder template not configured')
          await notifyReminder(a.phone, a.name, event.date, event.venue, templateId)
        } else {
          const templateId = settings?.whatsappTemplateSelected
          if (!templateId) throw new Error('Selected template not configured')
          if (!a.passUrl) throw new Error('No pass URL')
          await notifySelected(a.phone, a.name, `${baseUrl}${BASE_PATH}/pass/${a.id}`, templateId)
        }
        await prisma.attendee.update({ where: { id: a.id }, data: { notifiedAt: new Date() } })
        results.sent++
      } catch (e) {
        results.failed++
        results.errors.push(`${a.name} (${a.phone}): ${String(e)}`)
      }
    }

    return Response.json(results)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
