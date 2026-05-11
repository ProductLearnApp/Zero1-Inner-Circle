import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifySelected, notifyReminder } from '@/lib/whatsapp'

type Params = { params: { id: string } }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { type = 'selected' } = (await req.json().catch(() => ({}))) as { type?: string }

    const attendee = await prisma.attendee.findUnique({
      where: { id: params.id },
      include: { event: { include: { settings: true } } },
    })
    if (!attendee) return Response.json({ error: 'Not found' }, { status: 404 })

    const settings = attendee.event.settings
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''

    if (type === 'reminder') {
      const templateId = settings?.whatsappTemplateReminder
      if (!templateId) return Response.json({ error: 'Reminder template not configured' }, { status: 400 })
      await notifyReminder(attendee.phone, attendee.name, attendee.event.date, attendee.event.venue, templateId)
    } else {
      const templateId = settings?.whatsappTemplateSelected
      if (!templateId) return Response.json({ error: 'Selected template not configured' }, { status: 400 })
      if (!attendee.passUrl) return Response.json({ error: 'Attendee has no pass URL (not selected)' }, { status: 400 })
      await notifySelected(attendee.phone, attendee.name, `${baseUrl}${attendee.passUrl}`, templateId)
    }

    await prisma.attendee.update({
      where: { id: params.id },
      data: { notifiedAt: new Date() },
    })

    return Response.json({ ok: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
