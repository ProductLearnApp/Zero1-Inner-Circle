import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PassClient from './PassClient'

type Props = { params: { passId: string } }

export default async function PassPage({ params }: Props) {
  const attendee = await prisma.attendee.findUnique({
    where: { id: params.passId },
    include: { event: { include: { settings: true } } },
  }).catch(() => null)

  if (!attendee) notFound()

  const isSelected = attendee.status === 'SELECTED' || attendee.status === 'CHECKED_IN'

  return (
    <PassClient
      attendee={{
        id:               attendee.id,
        name:             attendee.name,
        phone:            attendee.phone,
        status:           attendee.status,
        seatLabel:        attendee.seatLabel,
        checkedIn:        attendee.checkedIn,
        plusOneName:      attendee.plusOneName,
        plusOnePhone:     attendee.plusOnePhone,
        plusOneCheckedIn: attendee.plusOneCheckedIn,
        // only expose QR payloads to selected/checked-in attendees
        qrPayload:        isSelected ? attendee.qrPayload        : null,
        plusOneQrPayload: isSelected ? attendee.plusOneQrPayload : null,
        event: {
          id:           attendee.event.id,
          name:         attendee.event.name,
          date:         attendee.event.date,
          time:         attendee.event.time,
          city:         attendee.event.city,
          venue:        attendee.event.venue,
          heroImageUrl: attendee.event.heroImageUrl,
          settings: attendee.event.settings ? {
            ...attendee.event.settings,
            passPointsToRemember: Array.isArray(attendee.event.settings.passPointsToRemember)
              ? attendee.event.settings.passPointsToRemember as string[]
              : null,
          } : null,
        },
      }}
    />
  )
}
