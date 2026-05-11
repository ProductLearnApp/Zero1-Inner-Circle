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
        ...attendee,
        checkedInAt:        attendee.checkedInAt?.toISOString()        ?? null,
        plusOneCheckedInAt: attendee.plusOneCheckedInAt?.toISOString() ?? null,
        uploadedAt:         attendee.uploadedAt.toISOString(),
        notifiedAt:         attendee.notifiedAt?.toISOString()         ?? null,
        // only expose QR payloads to selected/checked-in attendees
        qrPayload:          isSelected ? attendee.qrPayload          : null,
        plusOneQrPayload:   isSelected ? attendee.plusOneQrPayload    : null,
      }}
    />
  )
}
