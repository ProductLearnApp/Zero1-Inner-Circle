import * as fs from 'fs'
import * as path from 'path'

// Load .env.local so the seed works without dotenv-cli
const envPath = path.resolve(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/)
    if (match) {
      const [, key, val] = match
      if (!process.env[key]) process.env[key] = val.replace(/^["']|["']$/g, '')
    }
  }
}

import { PrismaClient, AttendeeStatus } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

function generateQR(data: {
  attendeeId: string
  eventId: string
  name: string
  seatLabel: string
  passType?: 'primary' | 'plusone'
}): string {
  const secret = process.env.QR_SECRET
  if (!secret) throw new Error('QR_SECRET env var is required for seed')
  return jwt.sign(
    { ...data, passType: data.passType ?? 'primary', issuedAt: Date.now() },
    secret,
    { algorithm: 'HS256' }
  )
}

type DummyAttendee = {
  name: string
  phone: string
  status: AttendeeStatus
  seatLabel: string | null
  plusOne?: { name: string; phone: string }
}

const DUMMY_ATTENDEES: DummyAttendee[] = [
  { name: 'Arjun Mehta',   phone: '+919876543210', status: AttendeeStatus.SELECTED,     seatLabel: 'A-01',
    plusOne: { name: 'Rahul Mehta',    phone: '+919876540001' } },
  { name: 'Priya Sharma',  phone: '+919876543211', status: AttendeeStatus.SELECTED,     seatLabel: 'A-02',
    plusOne: { name: 'Neelam Sharma',  phone: '+919876540002' } },
  { name: 'Rohit Verma',   phone: '+919876543212', status: AttendeeStatus.SELECTED,     seatLabel: 'A-03' },
  { name: 'Sneha Kapoor',  phone: '+919876543213', status: AttendeeStatus.SELECTED,     seatLabel: 'B-01' },
  { name: 'Anjali Reddy',  phone: '+919876543217', status: AttendeeStatus.SELECTED,     seatLabel: 'B-02' },
  { name: 'Karan Joshi',   phone: '+919876543214', status: AttendeeStatus.NOT_SELECTED, seatLabel: null   },
  { name: 'Neha Gupta',    phone: '+919876543215', status: AttendeeStatus.NOT_SELECTED, seatLabel: null   },
  { name: 'Vikram Singh',  phone: '+919876543216', status: AttendeeStatus.REJECTED,     seatLabel: null   },
]

async function main() {
  // ── 1. Event ──────────────────────────────────────────────────────────────
  let event = await prisma.event.findFirst({ orderBy: { createdAt: 'desc' } })

  if (!event) {
    event = await prisma.event.create({
      data: {
        name:    process.env.NEXT_PUBLIC_EVENT_NAME  ?? 'Zero1 Money Circle',
        date:    process.env.NEXT_PUBLIC_EVENT_DATE  ?? 'May 24, 2025',
        time:    process.env.NEXT_PUBLIC_EVENT_TIME  ?? '6:00 PM – 9:00 PM',
        city:    process.env.NEXT_PUBLIC_EVENT_CITY  ?? 'Mumbai',
        venue:   process.env.NEXT_PUBLIC_EVENT_VENUE ?? 'TBD — sent 24 hrs before',
        settings: { create: {} },
      },
    })
    console.log(`✓ Created event: ${event.id} — ${event.name}`)
  } else {
    console.log(`→ Event already exists: ${event.id} — ${event.name}`)
  }

  // ── 2. Attendees ──────────────────────────────────────────────────────────
  let created = 0
  let skipped = 0

  for (const row of DUMMY_ATTENDEES) {
    const existing = await prisma.attendee.findUnique({
      where: { eventId_phone: { eventId: event.id, phone: row.phone } },
    })

    if (existing) {
      // Backfill QR / +1 data if missing
      const updates: Record<string, unknown> = {}
      if (existing.status === AttendeeStatus.SELECTED && !existing.qrPayload && row.seatLabel) {
        updates.qrPayload = generateQR({ attendeeId: existing.id, eventId: event.id, name: row.name, seatLabel: row.seatLabel })
        updates.passUrl   = `/pass/${existing.id}`
        console.log(`  ↺ Backfilled primary QR for ${row.name}`)
      }
      if (row.plusOne && !existing.plusOneName) {
        updates.plusOneName  = row.plusOne.name
        updates.plusOnePhone = row.plusOne.phone
        updates.plusOneQrPayload = generateQR({
          attendeeId: existing.id, eventId: event.id,
          name: row.plusOne.name, seatLabel: row.seatLabel ?? '', passType: 'plusone',
        })
        console.log(`  ↺ Backfilled +1 (${row.plusOne.name}) for ${row.name}`)
      }
      if (Object.keys(updates).length) {
        await prisma.attendee.update({ where: { id: existing.id }, data: updates as Parameters<typeof prisma.attendee.update>[0]['data'] })
      }
      skipped++
      continue
    }

    const attendee = await prisma.attendee.create({
      data: {
        eventId:   event.id,
        name:      row.name,
        phone:     row.phone,
        status:    row.status,
        seatLabel: row.seatLabel,
        ...(row.plusOne ? {
          plusOneName:  row.plusOne.name,
          plusOnePhone: row.plusOne.phone,
        } : {}),
      },
    })

    if (row.status === AttendeeStatus.SELECTED) {
      const qrPayload = generateQR({
        attendeeId: attendee.id,
        eventId:    event.id,
        name:       row.name,
        seatLabel:  row.seatLabel ?? '',
      })
      const plusOneQrPayload = row.plusOne
        ? generateQR({ attendeeId: attendee.id, eventId: event.id, name: row.plusOne.name, seatLabel: row.seatLabel ?? '', passType: 'plusone' })
        : null
      await prisma.attendee.update({
        where: { id: attendee.id },
        data:  { qrPayload, passUrl: `/pass/${attendee.id}`, ...(plusOneQrPayload ? { plusOneQrPayload } : {}) },
      })
    }

    created++
    console.log(`  ✓ ${row.name} (${row.status})`)
  }

  console.log(`\nSeed complete — ${created} attendees created, ${skipped} already existed.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
