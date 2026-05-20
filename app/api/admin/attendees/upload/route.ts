import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizePhone } from '@/lib/phone'
import { generateQRPayload } from '@/lib/qr'
import { AttendeeStatus } from '@prisma/client'

type CSVRow = Record<string, string>

/** Normalize header keys: lowercase + strip spaces/underscores */
function key(row: CSVRow, ...candidates: string[]): string {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.toLowerCase().replace(/[\s_]/g, ''), v])
  )
  for (const c of candidates) {
    const val = normalized[c.toLowerCase().replace(/[\s_]/g, '')]
    if (val !== undefined) return val
  }
  return ''
}

function parseStatus(raw: string): AttendeeStatus {
  const val = raw.toLowerCase().trim().replace(/[\s_-]/g, '')
  if (val === 'selected') return AttendeeStatus.SELECTED
  if (val === 'rejected') return AttendeeStatus.REJECTED
  return AttendeeStatus.NOT_SELECTED
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { rows: CSVRow[]; eventId: string }
    const { rows, eventId } = body

    if (!eventId) return Response.json({ error: 'eventId required' }, { status: 400 })

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) return Response.json({ error: 'Event not found' }, { status: 404 })

    // Pre-validate rows before opening the transaction so we skip known-bad
    // entries without consuming transaction time.
    type ValidRow = {
      name: string
      phone: string
      status: AttendeeStatus
      seatLabel: string | undefined
    }

    const validRows: ValidRow[] = []
    const errors: string[] = []

    for (const row of rows) {
      const name = key(row, 'name').trim()
      const rawPhone = key(row, 'phone', 'mobile', 'phonenumber').trim()
      const rawStatus = key(row, 'status').trim()
      const seatLabel = key(row, 'seatLabel', 'seat_label', 'seat').trim() || undefined

      if (!name || !rawPhone) {
        errors.push(`Skipped — missing name or phone: ${JSON.stringify(row)}`)
        continue
      }

      const phone = normalizePhone(rawPhone)
      if (!phone) {
        errors.push(`Invalid phone "${rawPhone}" for ${name}`)
        continue
      }

      validRows.push({ name, phone, status: parseStatus(rawStatus), seatLabel })
    }

    let added = 0
    let updated = 0

    // Run all DB writes atomically — either all succeed or none do.
    // Timeout raised to 30 s to handle large CSVs.
    await prisma.$transaction(
      async (tx) => {
        for (const { name, phone, status, seatLabel } of validRows) {
          const existing = await tx.attendee.findUnique({
            where: { eventId_phone: { eventId, phone } },
          })

          if (existing) {
            const needsQR = status === AttendeeStatus.SELECTED && !existing.qrPayload
            const qrPayload = needsQR
              ? generateQRPayload({
                  attendeeId: existing.id,
                  eventId,
                  passType: 'primary',
                  name,
                  seatLabel: seatLabel ?? existing.seatLabel ?? '',
                })
              : existing.qrPayload

            await tx.attendee.update({
              where: { id: existing.id },
              data: {
                name,
                status,
                ...(seatLabel ? { seatLabel } : {}),
                ...(needsQR ? { qrPayload, passUrl: `/pass/${existing.id}` } : {}),
              },
            })
            updated++
          } else {
            const created = await tx.attendee.create({
              data: { eventId, name, phone, status, seatLabel },
            })
            if (status === AttendeeStatus.SELECTED) {
              const qrPayload = generateQRPayload({
                attendeeId: created.id,
                eventId,
                passType: 'primary',
                name,
                seatLabel: seatLabel ?? '',
              })
              await tx.attendee.update({
                where: { id: created.id },
                data: { qrPayload, passUrl: `/pass/${created.id}` },
              })
            }
            added++
          }
        }
      },
      { timeout: 30_000 },
    )

    return Response.json({ added, updated, errors })
  } catch (e) {
    console.error(e)
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
